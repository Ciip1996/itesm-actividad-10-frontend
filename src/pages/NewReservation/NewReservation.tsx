import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@atoms/Card";
import { Button } from "@atoms/Button";
import { Alert } from "@atoms/Alert";
import { TextField } from "@molecules/FormField";
import { Input } from "@atoms/Input";
import { FormField } from "@molecules/FormField";
import { useReservations } from "@hooks/useReservations";
import { getToday, addDaysToDate } from "@utils/date.utils";
import { formatTimeToAMPM } from "@utils/format.utils";
import { APP_CONFIG } from "@config/index";
import "./NewReservation.scss";
import { useAuth } from "@/hooks";
import { useLanguage } from "@/i18n";
import { supabase } from "@/services/supabase";

export const NewReservation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { createReservation, checkAvailability, loading, error } =
    useReservations(t);

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

  // Obtener el email del usuario autenticado
  useEffect(() => {
    const getUserEmail = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email) {
        setFormData((prev) => ({
          ...prev,
          email_cliente: session.user.email || "",
        }));
      }
    };

    if (user) {
      getUserEmail();
    }
  }, [user]);

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

      // Validar que slots sea un array
      if (!Array.isArray(slots)) {
        setAvailableSlots([]);
        setStep(2);
        return;
      }

      const available = slots.filter((s) => s.disponible).map((s) => s.hora);

      setAvailableSlots(available);
      setStep(2);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Asegurar que la hora esté en formato HH:MM (sin segundos)
    // La hora viene del backend como "HH:MM:SS", necesitamos enviarla como "HH:MM"
    const horaFormateada = formData.hora.includes(":")
      ? formData.hora.substring(0, 5)
      : formData.hora;

    const reservationData = {
      ...formData,
      hora: horaFormateada,
      numero_personas: Number(formData.numero_personas), // Asegurar que sea número
    };

    try {
      const result = await createReservation(reservationData);

      // Manejar diferentes estructuras de respuesta
      const folio =
        result?.folio || result?.data?.folio || result?.reserva?.folio || "N/A";

      setSuccessMessage(`${t.newReservation.successMessage} ${folio}`);

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
            <h1 className="new-reservation__title">{t.newReservation.title}</h1>

            {error && <Alert variant="error">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}

            {step === 1 ? (
              <div className="new-reservation__step">
                <h2 className="new-reservation__step-title">
                  {t.newReservation.step1Title}
                </h2>

                <FormField label={t.newReservation.date} required>
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

                <FormField label={t.newReservation.guests} required>
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
                  {t.newReservation.checkAvailability}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="new-reservation__step">
                <h2 className="new-reservation__step-title">
                  {t.newReservation.step2Title}
                </h2>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                >
                  {t.newReservation.back}
                </Button>

                <FormField label={t.newReservation.timeSlot} required>
                  <select
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className="new-reservation__select"
                    required
                  >
                    <option value="">{t.newReservation.selectTime}</option>
                    {availableSlots.map((hora) => (
                      <option key={hora} value={hora}>
                        {formatTimeToAMPM(hora)}
                      </option>
                    ))}
                  </select>
                </FormField>

                <TextField
                  label={t.newReservation.fullName}
                  type="text"
                  name="nombre_cliente"
                  value={formData.nombre_cliente}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label={t.newReservation.email}
                  type="email"
                  name="email_cliente"
                  value={formData.email_cliente}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label={t.newReservation.phone}
                  type="tel"
                  name="telefono_cliente"
                  value={formData.telefono_cliente}
                  onChange={handleChange}
                  required
                />

                <FormField label={t.newReservation.specialNotes}>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    className="new-reservation__textarea"
                    rows={4}
                    placeholder={t.newReservation.notesPlaceholder}
                  />
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                >
                  {t.newReservation.confirm}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
