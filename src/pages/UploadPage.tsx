import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const navigate = useNavigate();

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
      </div>
    </section>
  );
}
