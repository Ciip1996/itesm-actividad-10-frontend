import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@atoms/Card";
import { Button } from "@atoms/Button";
import { Alert } from "@atoms/Alert";
import { TextField } from "@molecules/FormField";
import { useAuth } from "@hooks/useAuth";
import { handleError } from "@utils/error.utils";
import "./Login.scss";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      navigate("/reservations");
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
            <h1 className="login__title">Iniciar Sesión</h1>
            <p className="login__subtitle">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>

            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="login__form">
              <TextField
                label="Correo Electrónico"
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />

              <TextField
                label="Contraseña"
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
                Iniciar Sesión
              </Button>
            </form>

            <div className="login__footer">
              <p className="login__footer-text">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="login__link">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
