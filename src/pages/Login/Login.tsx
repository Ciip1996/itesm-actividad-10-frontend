import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card } from "@atoms/Card";
import { Button } from "@atoms/Button";
import { Alert } from "@atoms/Alert";
import { TextField } from "@molecules/FormField";
import { useAuth } from "@hooks/useAuth";
import { useLanguage } from "@/i18n";
import { handleError } from "@utils/error.utils";
import "./Login.scss";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener la ruta a la que intentaba acceder antes del login
  const locationState = location.state as { from?: { pathname: string } } | null;
  const from = locationState?.from?.pathname || "/reservations";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("🔵 Iniciando proceso de login...");

    try {
      console.log("🔵 Llamando a signIn...");
      await signIn(formData.email, formData.password);
      console.log("✅ signIn completado exitosamente");
      // Redirigir a la página a la que intentaba acceder o a reservations por defecto
      navigate(from, { replace: true });
    } catch (err) {
      console.error("❌ Error en handleSubmit:", err);
      setError(handleError(err));
      setLoading(false);
    } finally {
      console.log("🔵 Finally ejecutado, loading:", false);
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="login__wrapper">
          <Card className="login__card" padding="lg" shadow="lg">
            <h1 className="login__title">{t.login.title}</h1>
            <p className="login__subtitle">{t.login.subtitle}</p>

            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="login__form">
              <TextField
                label={t.login.email}
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />

              <TextField
                label={t.login.password}
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                {t.login.submit}
              </Button>
            </form>

            <div className="login__footer">
              <p className="login__footer-text">
                {t.login.noAccount}{" "}
                <Link to="/register" className="login__link">
                  {t.login.registerHere}
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
