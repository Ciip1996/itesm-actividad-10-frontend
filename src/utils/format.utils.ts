import clsx, { ClassValue } from "clsx";

/**
 * Combinar clases CSS
 * Utiliza clsx para manejar clases condicionales
 */
export const cn = (...classes: ClassValue[]): string => {
  return clsx(classes);
};

/**
 * Generar clase BEM
 */
export const bem = (
  block: string,
  element?: string,
  modifiers?: string | string[] | Record<string, boolean>
): string => {
  let className = block;

  if (element) {
    className += `__${element}`;
  }

  if (modifiers) {
    if (typeof modifiers === "string") {
      className += ` ${block}--${modifiers}`;
    } else if (Array.isArray(modifiers)) {
      modifiers.forEach((modifier) => {
        className += ` ${block}--${modifier}`;
      });
    } else {
      Object.entries(modifiers).forEach(([modifier, active]) => {
        if (active) {
          className += ` ${block}--${modifier}`;
        }
      });
    }
  }

  return className;
};

/**
 * Truncar texto
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalizar primera letra
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convertir a title case
 */
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Format time to AM/PM format
 * @param time - Time in 24-hour format (HH:mm:ss or HH:mm)
 * @returns Time in 12-hour format with AM/PM
 */
export const formatTimeToAMPM = (time: string): string => {
  // Extract hours and minutes (ignore seconds if present)
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr || "00";

  // Determine AM/PM
  const period = hour >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  // Format
  return `${hour12}:${minute} ${period}`;
};
