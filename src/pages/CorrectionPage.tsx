import Button from "@/components/Button";
import Card from "@/components/Card";
import { EditableCell } from "@/components/EditableCell";
import { csvRowSchema } from "@/schemas/csv-row.schema";
import type { UploadRow } from "@prisma/client";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type RowError = {
  path: string[];
  message: string;
};


export function CorrectionPage() {
  const [rows, setRows] = useState<UploadRow[]>([]);
  const {id} = useParams();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  //Carga el estado de job desde la DB
  //Solo se carga filas cuando existan campos que corregir
  useEffect(() => {
    async function loadData() {
      const jobRes = await fetch(`/upload-jobs/${id}`, {
        credentials: "include",
      });
      const job = await jobRes.json();

      if (job.status === "COMPLETED") {
        setCompleted(true);
        setLoading(false)
        return;
      }

      const rowsRes = await fetch(`/upload-jobs/${id}/rows`, {
        credentials: "include",
      });

      const rows = await rowsRes.json();

      setRows(rows);
      setLoading(false);
    }

    loadData();
  }, [id]);

  //Funcion que valida las filas y genera el formato que encaja con RowError
  function validateRow(row: UploadRow) {
    const result = csvRowSchema.safeParse({
      name: row.name,
      email: row.email,
      age: row.age,
    });
    if (result.success) {
      return {
        isValid: true,
        errors: [],
      };
    }
    return {
      isValid: false,
      errors: result.error.issues.map(issue => ({
        path: issue.path.map(String),
        message: issue.message,
      })),
    };
  }

  const updateRow = (id: string, field: string, value: any) => {
    setRows(prev =>
    prev.map(row => {
      if (row.id !== id) {
        return row;
      }

      const updatedRow = {
        ...row,
        [field]: value,
      };

      const validation =
        validateRow(updatedRow);

      return {
        ...updatedRow,
        isValid: validation.isValid,
        errors: validation.errors,
      };
    })
    );
  };

  const hasErrors = rows.some(row => !row.isValid);

  //Reload para refrescar los mesages de error en email
  //En una version futura se usará  useRevalidator de React Router 
  async function reloadRows() {
    const response = await fetch(
      `/upload-jobs/${id}/rows`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    setRows(data);
  }

  async function saveChanges() {

    //Evita modoficar el HTML desde DevTools 
    if (hasErrors) {
      alert(
        "Existen errores pendientes por corregir"
      );
      return;
    }
    const response = await fetch("/upload-rows/bulk-update", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rows),
    });

    const data = await response.json();
    
    if (!response.ok) {
      await reloadRows();//Vuelve a traer los errores actualizados
      return;
    }
    if (data.ok) {
      setCompleted(true);
    }
  }

  function getFieldError( row: UploadRow, field: string) {
    if (!Array.isArray(row.errors)) {
      return null;
    }
    const errors = row.errors as RowError[] | null;
    
    if (!errors) {
      return null;
    }

    const error = errors.find(
      (err) => err.path?.[0] === field
    );

    return error?.message ?? null;
  }

  //Evita el parpadeo al refrescar despues de carga exitosa
  if (loading) {
    return null;
  }
  return (
    <main>
      {!completed ? 
        <div className="correction-shell">
          <Card className="correction-card">
            <div className="correction-header">
              <h1>Corrección de registros</h1>
              <p>
                Corrige los datos marcados para completar la carga.
              </p>
            </div>
              
            <div className="table-wrapper">
              <table className="correction-table">
                <thead>
                  <tr>
                    <th>Fila</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Edad</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="text-[var(--neutral-8)] font-medium">
                        {row.rowNumber}
                      </td>
                  
                      <td>
                        <EditableCell
                          value={row.name}
                          field="name"
                          rowId={row.id}
                          error={getFieldError(row, "name")}
                          onChange={updateRow}
                        />
                      </td>
                      
                      <td>
                        <EditableCell
                          value={row.email}
                          field="email"
                          rowId={row.id}
                          error={getFieldError(row, "email")}
                          onChange={updateRow}
                          type="email"
                        />
                      </td>
                      
                      <td>
                        <EditableCell
                          value={row.age}
                          field="age"
                          rowId={row.id}
                          error={getFieldError(row, "age")}
                          onChange={updateRow}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              
            <div className="action-bar">
              <Button
                className="btn-primary"
                onClick={saveChanges}
                disabled={hasErrors}
              >
                Guardar cambios
              </Button>
            </div>
          </Card>
        </div> 
        :
        <div>
          <Card className="success-panel success-panel">
            <h1>Corrección completada</h1>

            <p>
              Las filas fueron corregidas y procesadas
              correctamente.
            </p>

            <Link to="/upload">
              <Button className="btn-primary" >
                Volver a cargas
              </Button>
            </Link>
          </Card>
        </div>
      }

    </main>
  );
}
