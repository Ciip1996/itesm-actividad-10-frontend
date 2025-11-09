import {
  format,
  parse,
  addDays,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatear fecha a string legible
 */
export const formatDate = (date: Date | string, formatStr = "PP"): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: es });
};

/**
 * Formatear hora a string legible
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

/**
 * Formatear fecha y hora juntos
 */
export const formatDateTime = (date: string, time: string): string => {
  return `${formatDate(date, "PPP")} a las ${formatTime(time)}`;
};

/**
 * Parsear fecha de string
 */
export const parseDate = (dateStr: string): Date => {
  return parse(dateStr, "yyyy-MM-dd", new Date());
};

/**
 * Obtener fecha de hoy
 */
export const getToday = (): string => {
  return format(new Date(), "yyyy-MM-dd");
};

/**
 * Agregar días a una fecha
 */
export const addDaysToDate = (date: string, days: number): string => {
  const dateObj = parseDate(date);
  return format(addDays(dateObj, days), "yyyy-MM-dd");
};

/**
 * Verificar si una fecha es futura
 */
export const isFutureDate = (date: string): boolean => {
  const dateObj = parseDate(date);
  return isAfter(dateObj, startOfDay(new Date()));
};

/**
 * Verificar si una fecha está en el pasado
 */
export const isPastDate = (date: string): boolean => {
  const dateObj = parseDate(date);
  return isBefore(dateObj, startOfDay(new Date()));
};

/**
 * Obtener rango de fechas disponibles para reservación
 */
export const getAvailableDateRange = (
  maxDaysAhead = 90
): { min: string; max: string } => {
  const today = new Date();
  return {
    min: format(today, "yyyy-MM-dd"),
    max: format(addDays(today, maxDaysAhead), "yyyy-MM-dd"),
  };
};
