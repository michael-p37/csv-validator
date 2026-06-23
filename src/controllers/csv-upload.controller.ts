import fs from "fs";
import csv from "csv-parser";
import type { NextFunction, Request, Response } from "express";
import { csvRowSchema, type CsvRow } from "@/schemas/csv-row.schema";
import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";

type ValidationIssue = {
  path: string [];
  message: string;
}

interface CsvValidationError {
  row: number;
  data: Partial<CsvRow>;
  issues: ValidationIssue[];
}

export const uploadController = {
  async upLoadCsv(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Archivo requerido"
      });
    }

    const errors: CsvValidationError[] = [];
    let rowNumber = 2;
    const expectedHeaders = Object.keys(csvRowSchema.shape) as Array<keyof CsvRow>;
    let headerError: string | null = null;

    let duplicateCount = 0;

    const validPersons: Prisma.PersonCreateManyInput[] = [];
    const invalidRows: Prisma.UploadRowCreateManyInput[] = [];

    if (!req.session.userId) {
      return res.status(401).json({
        ok: false,
        message: "No autenticado",
      });
    }

    const uploadJob = await prisma.uploadJob.create({
      data: {
        uploadedBy: req.session.userId,
        status: "PENDING",
      },
    });
    
    fs.createReadStream(req.file.path)
      .pipe(csv())

      .on("headers", (headers: string[]) => {
        const valid = headers.length === expectedHeaders.length && headers.every(
          (header, index) => header.trim() === expectedHeaders[index]
        );

        if (!valid) {
          headerError = `El archivo debe tener los encabezados: ${expectedHeaders.join(", ")}`
        }
      })
      .on("data", (row) => {
        // Si los encavezados son invalidos, ignorar las filas
        if (headerError) return;

        const result = csvRowSchema.safeParse(row);

        if (result.success) {
          validPersons.push({
            name: result.data.name,
            email: result.data.email,
            age: result.data.age,
          });
        } else {
          const issues = result.error.issues.map(issue => ({
            path: issue.path.map(String),
            message: issue.message,
          }));
          errors.push({
            row: rowNumber,
            data: row,
            issues,
          });
        
          invalidRows.push({
            uploadJobId: uploadJob.id,
            rowNumber,
          
            name: row.name ?? null,
            email: row.email ?? null,
            age: row.age ? Number(row.age) : null,

            isValid: false,

            errors: issues,
          });
        }
        rowNumber++;
      })
      .on("end", async () => {
        if (headerError) {
          return res.status(400).json({
            ok: false,
            error: headerError,
          });
        }

        //Se extraen datos para validar datos duplicados
        const existingPersons = await prisma.person.findMany({
          where: {
            email: {
              in: validPersons.map(p => p.email),
            },
          },
          select: {
            email: true,
          },
        });
        
        // Se crea una coleccion de emails donde no existen duplicados 
        const existingEmails = new Set(existingPersons.map(p => p.email));
        
        const personsToInsert: Prisma.PersonCreateManyInput[] = [];
        
        for (const person of validPersons) {
          if (existingEmails.has(person.email)) {
              duplicateCount++;
              continue;
          } 

          //Actualizacion del Set durante el recorrido
          //Detecta emails duplicados en el mismo lote validPersons
          existingEmails.add(person.email);

          personsToInsert.push({
            name: person.name,
            email: person.email,
            age: person.age,
          });
        }
        
        if (personsToInsert.length > 0) {
          await prisma.person.createMany({
            data: personsToInsert,
            skipDuplicates: true,
          });
        }

        if (invalidRows.length > 0) {
          await prisma.uploadRow.createMany({
            data: invalidRows,
          });
        }
                
        await prisma.uploadJob.update({
          where: {
            id: uploadJob.id,
          },
          data: {
            status: invalidRows.length > 0
              ? "VALIDATED"
              : "COMPLETED",
          },
        });

        return res.json({
          ok: true, //true evita inconsistencia entre HTTP status y el campo ok del JSON
          uploadJobId: uploadJob.id,
          totalRows: validPersons.length + invalidRows.length,
          validRows: personsToInsert.length,
          invalidRows: invalidRows.length,
          duplicateRows: duplicateCount,
        });
      })
      .on("error", (err) => {
        return res.status(500).json({
          ok: false,
          errors: err.message,
        });
      });
  },

  async uploadJobs(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        ok: false,
        message: "id inválido",
      })
    }
    const rows = await prisma.uploadRow.findMany({
      where: { uploadJobId: id, isValid: false, },
      orderBy: { rowNumber: "asc" },
    });
    
    return res.status(200).json(rows);
  },

  async bulkUpdate(req: Request, res: Response) {
    const rows = req.body;
    const uploadJobId = rows[0]?.uploadJobId;

    let hasDuplicateErrors = false;
    const seenEmails = new Set<string>();

    const emails = rows.map((row: any) => row.email);

    await prisma.uploadRow.updateMany({
      where: {
        uploadJobId,
      },
      data: {
        errors: Prisma.JsonNull,
      },
    });

    const existingPersons = await prisma.person.findMany({
      where: {
        email: {in: emails},
      },
      select: {
        email: true,
      }
    })
    const existingEmails = new Set(existingPersons.map(p => p.email));

    //Esta forma de validacion no es efectivo en cientos de datos a validar
    //En caso de este proyecto se usa para mostrar mensaje de error en la misma tabla de correccion
    for (const row of rows) {
      //Detecta duplicado desde la DB
      if (existingEmails.has(row.email)) {
        hasDuplicateErrors = true;
        //Actualiza
        await prisma.uploadRow.update({
          where: {
            id: row.id,
          },
          data: {
            errors: [
              {
                path: ["email"],
                message: "El email ya existe en la base de datos",
              },
            ],
            isValid: false,
          },
        });
      }
    
      //Duplicado en la misma carga
      if (seenEmails.has(row.email)) {
        hasDuplicateErrors = true;
        await prisma.uploadRow.update({
          where: {
            id: row.id,
          },
          data: {
            errors: [
              {
                path: ["email"],
                message: "Email duplicado en las correcciones",
              },
            ],
            isValid: false,
          },
        });
      }

      seenEmails.add(row.email);
    }
    
    //la regla "no usar 400", en este caso si se puede omitir
    //Es una operacion que puede fallar, entoces es razonable responder asi
    //Siempre que los errores ya esten guardados en uploadRow.errors
    //Siempre que el frontend Recargue la tabla
    if (hasDuplicateErrors) {
      return res.status(400).json({
        ok: false,
      });
    }

    const personsToCreate:  Prisma.PersonCreateManyInput[] = [];

    for (const row of rows) {
      const result = csvRowSchema.safeParse({
        name: row.name,
        email: row.email,
        age: Number(row.age),
      });

      //Validacion de filas desde el backend
      if (!result.success) {
        return res.status(400).json({
          ok: false,
          message: "Existen filas inválidas",
        });
      }

      await prisma.uploadRow.update({
        where: {
          id: row.id,
        },
        data: {
          name: row.name,
          email: row.email,
          age: Number(row.age),

          isValid: true,
          errors: Prisma.JsonNull,
        },
      });
      //No es eficiente crear en DB uno por uno dentro del loop
      personsToCreate.push({
        name: result.data.name,
        email: result.data.email,
        age: result.data.age,
      })
    }

    //Crear datos despues de acumular en personsToCreate
    await prisma.person.createMany({
      data: personsToCreate,
    });

    //Despues de que todas las filas fueron corregidos se actualiza el job
    await prisma.uploadJob.update({
      where: {
        id: uploadJobId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    return res.status(200).json({ ok: true });
  },
  
  async uploadJobsStatus(req: Request, res: Response) {
    const {id} = req.params
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        ok: false,
        message: "id inválido",
      })
    }
    const job = await prisma.uploadJob.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
      },
    });
  
    return res.status(200).json(job);
  }
}
