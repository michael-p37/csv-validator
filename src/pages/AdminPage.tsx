export function AdminPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Panel de administración</h1>
        <p className="mt-2 text-slate-600">
          Aquí puedes administrar el sistema y revisar los registros de carga.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-700">
          Esta vista está protegida y solo está disponible para administradores.
        </p>
      </div>
    </section>
  );
}
