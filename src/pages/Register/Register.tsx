import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@atoms/Card";
import { Button } from "@atoms/Button";
import { Alert } from "@atoms/Alert";
import { TextField } from "@molecules/FormField";
import { getErrorMessage } from "@utils/error.utils";
import { UserRole } from "@/types";
import "./Register.scss";
import { useAuth } from "@/hooks";
import { useLanguage } from "@/i18n";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    telefono: "",
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t.register.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        rol: UserRole.CLIENTE,
      });
      navigate("/reservations");
    } catch (err) {
      setError(getErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="container">
        <div className="register__wrapper">
          <Card className="register__card" padding="lg" shadow="lg">
            <h1 className="register__title">{t.register.title}</h1>
            <p className="register__subtitle">{t.register.subtitle}</p>

            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="register__form">
              <div className="register__form-row">
                <TextField
                  label={t.register.firstName}
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label={t.register.lastName}
                  type="text"
                  name="apellido"
                  id="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>

              <TextField
                label={t.register.phone}
                type="tel"
                name="telefono"
                id="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                placeholder={t.register.phonePlaceholder}
              />

              <TextField
                label={t.register.email}
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />

              <TextField
                label={t.register.password}
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder={t.register.passwordPlaceholder}
              />

              <TextField
                label={t.register.confirmPassword}
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                {t.register.submit}
              </Button>
            </form>

            <div className="register__footer">
              <p className="register__footer-text">
                {t.register.hasAccount}{" "}
                <Link to="/login" className="register__link">
                  {t.register.loginLink}
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
