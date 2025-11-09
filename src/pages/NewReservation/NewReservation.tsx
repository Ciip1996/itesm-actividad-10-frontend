import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@atoms/Card";
import { Button } from "@atoms/Button";
import { Alert } from "@atoms/Alert";
import { TextField } from "@molecules/FormField";
import { Input } from "@atoms/Input";
import { FormField } from "@molecules/FormField";
import { useReservations } from "@hooks/useReservations";
import { getToday, addDaysToDate } from "@utils/date.utils";
import { APP_CONFIG } from "@config/index";
import "./NewReservation.scss";
import { useAuth } from "@/hooks";

export const NewReservation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createReservation, checkAvailability, loading, error } =
    useReservations();

  const [step, setStep] = useState<1 | 2>(1);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fecha: getToday(),
    hora: "",
    numero_personas: 2,
    nombre_cliente: user ? `${user.nombre} ${user.apellido}` : "",
    email_cliente: "",
    telefono_cliente: user?.telefono || "",
    notas: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckAvailability = async () => {
    try {
      const slots = await checkAvailability({
        fecha: formData.fecha,
        numero_personas: formData.numero_personas,
      });

      setAvailableSlots(slots.filter((s) => s.disponible).map((s) => s.hora));
      setStep(2);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createReservation(formData);
      setSuccessMessage(
        `¡Reservación creada exitosamente! Tu folio es: ${result.folio}`
      );

      setTimeout(() => {
        navigate("/reservations");
      }, 3000);
    } catch (err) {
      // Error handled by hook
    }
  };

  const maxDate = addDaysToDate(getToday(), APP_CONFIG.maxReservationDaysAhead);

  return (
    <div className="new-reservation">
      <div className="container">
        <div className="new-reservation__wrapper">
          <Card className="new-reservation__card" padding="lg" shadow="lg">
            <h1 className="new-reservation__title">Nueva Reservación</h1>

            {error && <Alert variant="error">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}

            {step === 1 ? (
              <div className="new-reservation__step">
                <h2 className="new-reservation__step-title">
                  Paso 1: Selecciona fecha y personas
                </h2>

                <FormField label="Fecha" required>
                  <Input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    min={getToday()}
                    max={maxDate}
                    required
                  />
                </FormField>

                <FormField label="Número de personas" required>
                  <Input
                    type="number"
                    name="numero_personas"
                    value={formData.numero_personas}
                    onChange={handleChange}
                    min={1}
                    max={APP_CONFIG.maxGuestsPerReservation}
                    required
                  />
                </FormField>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCheckAvailability}
                  loading={loading}
                >
                  Ver Disponibilidad
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="new-reservation__step">
                <h2 className="new-reservation__step-title">
                  Paso 2: Completa la información
                </h2>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                >
                  ← Volver
                </Button>

                <FormField label="Horario disponible" required>
                  <select
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className="new-reservation__select"
                    required
                  >
                    <option value="">Selecciona un horario</option>
                    {availableSlots.map((hora) => (
                      <option key={hora} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </select>
                </FormField>

                <TextField
                  label="Nombre completo"
                  type="text"
                  name="nombre_cliente"
                  value={formData.nombre_cliente}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label="Correo electrónico"
                  type="email"
                  name="email_cliente"
                  value={formData.email_cliente}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label="Teléfono"
                  type="tel"
                  name="telefono_cliente"
                  value={formData.telefono_cliente}
                  onChange={handleChange}
                  required
                />

                <FormField label="Notas especiales (opcional)">
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    className="new-reservation__textarea"
                    rows={4}
                    placeholder="Alergias, preferencias de mesa, etc."
                  />
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                >
                  Confirmar Reservación
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
