import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.get("email"), password: formData.get("password"),}),
        credentials: "same-origin",
      });

      const text = await response.text();

      if (!response.ok) {
        setError(text || "Correo electrónico o contraseña inválidos");
        return;
      }

      const data = JSON.parse(text) as { ok: boolean; redirect: string };
      if (data.ok && data.redirect) {
        navigate(data.redirect);
      } else {
        setError("No se pudo iniciar sesión. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <Card className="card-panel">
        <div className="login-heading">
          <p>Bienvenido</p>
          <h1>Iniciar sesión</h1>
          <span>Accede para ver tu panel de validación y cargar archivos CSV.</span>
        </div>

        {error ? <div className="form-alert">{error}</div> : null}
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-group">
            Correo electrónico
            <Input
              className="form-input"
              type="email"
              name="email"
              placeholder="tucorreo@dominio.com"
              required
            />
          </label>

          <label className="form-group">
            Contraseña
            <Input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </label>

          <Button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Iniciando sesión…" : "Iniciar sesión"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
