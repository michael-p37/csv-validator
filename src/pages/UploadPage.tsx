import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import { uploadResponseSchema } from "@/schemas/upload.schema";
import { useState } from "react";
import { Link } from "react-router-dom";

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const [uploadResult, setUploadResult] = useState<{
    uploadJobId: string;
    invalidRows: number;
  } | null>(null);

  async function handleSubmit(e:  React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (!file) {
        alert("Selecciona un archivo");
        return;
      }
  
      const formData = new FormData();
      formData.append("csv", file);
      const response = await fetch("/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const rawData = await response.json();
      const data = uploadResponseSchema.parse(rawData);
      setUploadResult({
        uploadJobId: data.uploadJobId,
        invalidRows: data.invalidRows,
      });
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="login-shell">
      
      <Card className="card-panel">
        <div className="flex justify-between items-start mb-8">
          <div className="login-heading">
            <h1>Cargar CSV</h1>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="upload-dropzone"
          style={{
            borderColor: "var(--border)",
            background: "var(--accent-2)",
          }}
        >
          <p
            className="mb-6"
            style={{ color: "var(--neutral-11)" }}
          >
            Selecciona un archivo CSV para comenzar la validación.
          </p>

          <Input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setFile(e.target.files?.[0] ?? null)
            }
            className="form-input"
          />

          <div className="mt-6">
            <Button
              type="submit"
              className="btn-primary"
            >
              Subir archivo
            </Button>
          </div>
        </form>

        {uploadResult?.invalidRows ? (
          <div className="form-alert mt-6">
            <p className="font-semibold">
              Se encontraron {uploadResult.invalidRows} filas
              con errores.
            </p>

            <Link
              to={`/upload-jobs/${uploadResult.uploadJobId}/errors`}
              className="mt-3 inline-block"
            >
              <Button className="btn-primary">
                Corregir errores
              </Button>
            </Link>
          </div>
        ) : (
          uploadResult && (
            <div className="form-alert mt-6">
              <p>
                Archivo procesado correctamente.
              </p>
            </div>
          )
        )}
      </Card>
    </div>
  );
}
