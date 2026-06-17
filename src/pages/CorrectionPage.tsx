import Button from "@/components/Button";
import Card from "@/components/Card";
import { EditableCell } from "@/components/EditableCell";
import Input from "@/components/Input";
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

  const updateRow = (id: string, field: string, value: any) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, [field]: value }
          : row
      )
    );
  };
  useEffect(() => {
    fetch(`/upload-jobs/${id}/rows`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setRows);
  }, [id]);

  async function saveChanges() {
    const response = await fetch("/upload-rows/bulk-update", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rows),
    });

    if (!response.ok) {
      alert("Error al guardar");
      return;
    }
    const data = await response.json();

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
              >
                Guardar cambios
              </Button>
            </div>
          </Card>
        </div> 
        :
        <div>
          <Card className="card-panel success-panel">
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
