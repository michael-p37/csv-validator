import { uploadResponseSchema } from "@/schemas/upload.schema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const handleLogout = async () => {
    try {
      const res = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  async function handleSubmit(e:  React.FormEvent<HTMLFormElement>) {
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

    const data = uploadResponseSchema.parse(await response.json());

    if (!response.ok) {
      alert(data.error);
    }

    if (data.ok) {
      console.log("Archivo cargado correctamente");
    } else {
    data.errors?.forEach((rowError) => {
      rowError.issues.forEach((issue) => {
        console.log(
          `Fila ${rowError.row}: ${issue.path.join(".")} - ${issue.message}`
        );
      });
    });
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Cargar CSV</h1>
          <p className="mt-2 text-slate-600">Sube archivos CSV para validación y análisis automático.</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
      <div className="grid gap-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <p className="text-slate-600">Arrastra archivos aquí o haz clic para seleccionar</p>
        <input type="file" multiple accept=".csv" className="hidden" />
        <form onSubmit={handleSubmit}>
        <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button type="submit">Subir</button>
        </form>
      </div>
    </section>
  );
}
