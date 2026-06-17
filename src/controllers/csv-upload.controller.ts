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

        if (validPersons.length > 0) {
          await prisma.person.createMany({
            data: validPersons,
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
            status: "COMPLETED",
          },
        });

        return res.json({
          ok: invalidRows.length === 0,
          uploadJobId: uploadJob.id,
          totalRows: validPersons.length + invalidRows.length,
          validRows: validPersons.length,
          invalidRows: invalidRows.length,
        });
      })
      .on("error", (err) => {
        return res.status(500).json({
          ok: false,
          errors: err.message,
        });
      });
  },

  async uploadJobs(req: Request, res: Response, next: NextFunction) {
     console.log("UPLOAD JOBS HIT");
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

    for (const row of rows) {
      const result = csvRowSchema.safeParse({
        name: row.name,
        email: row.email,
        age: Number(row.age),
      });

      if (!result.success) {
        continue;
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

      await prisma.person.create({
        data: {
          name: result.data.name,
          email: result.data.email,
          age: result.data.age,
        },
      });
    }
    return res.status(200).json({ ok: true });
  }  
}
