import fs from "fs";
import csv from "csv-parser";
import type { NextFunction, Request, Response } from "express";
import { csvRowSchema, type CsvRow } from "@/schemas/csv-row.schema";

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
  async loadCsv(req: Request, res: Response) {
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

        if (!result.success) {
          errors.push({
            row: rowNumber,
            data:row,
            issues: result.error.issues.map(issue => ({
              path: issue.path.map(String),
              message: issue.message,
            })),
          });
        }
        rowNumber++;
      })
      .on("end", () => {
        if (headerError) {
          return res.status(400).json({
            ok: false,
            error: headerError,
          });
        }
        return res.json({
          ok: errors.length === 0,
          totalRows: rowNumber - 2,
          errors,
        });
      })
      .on("error", (err) => {
        return res.status(500).json({
          ok: false,
          errors: err.message,
        });
      });
  },

  async updateCsv(req: Request, res: Response, next: NextFunction) {

  },
}
