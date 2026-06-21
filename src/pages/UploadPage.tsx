import Button from "@/components/Button";
import Card from "@/components/Card";
import { uploadErrorSchema } from "@/schemas/csv-row.schema";
import { uploadResponseSchema } from "@/schemas/upload.schema";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [uploadState, setUploadState] = useState<
    "idle" | "processing" | "done"
  >("idle");

  const [uploadResult, setUploadResult] = useState<{
    uploadJobId: string;
    invalidRows: number;
    duplicateRows: number;
    validRows: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);//limpia el imput visual
  
  async function handleSubmit(e:  React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploadState === "processing" || !file) return;

    if (!file) {
      alert("Selecciona un archivo");
      return;
    }

    setError("");
    setUploadState("processing");
    try {

      const formData = new FormData();
      formData.append("csv", file);
      const response = await fetch("/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const rowData = await response.json();

      if (!rowData.ok) {
        const error = uploadErrorSchema.parse(rowData);
        setError(error.error);
        setUploadState("idle");
        setFile(null);
        return;
      }

      const data = uploadResponseSchema.parse(rowData);
      setUploadResult({
        uploadJobId: data.uploadJobId,
        invalidRows: data.invalidRows,
        validRows: data.validRows,
        duplicateRows: data.duplicateRows,
      });
      setUploadState("done");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Error inesperado");
      setUploadState("done"); // Siempre liberar
    } finally {
      if (inputRef.current) inputRef.current.value = "";
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
          style={{ pointerEvents: uploadState === "processing" ? "none" : "auto" }}
        >
          <p
            className="mb-6"
            style={{ color: "var(--neutral-11)" }}
          >
            Selecciona un archivo CSV para comenzar la validación.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            disabled={uploadState === "processing" || uploadState === "done"}
            onChange={(e) =>
              setFile(e.target.files?.[0] ?? null)
            }
            className="form-input"
          />

          <div className="mt-6">
            <Button
              type="submit"
              className="btn-primary"
              disabled={uploadState === "processing" || uploadState === "done" || !file}
            >
              {uploadState === "processing" ? "Subiendo..." : "Subir archivo"}
            </Button>
          </div>
        </form>
        
        {error && (
          <span className="field-error">
            {error}
          </span>
        )}

        {uploadResult && uploadResult.duplicateRows > 0 && (
          <div className="form-alert">
            Se importaron {uploadResult.validRows} registros nuevos.  
            Se omitieron {uploadResult.duplicateRows} registros duplicados.
          </div>
        )}

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
