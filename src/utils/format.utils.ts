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
