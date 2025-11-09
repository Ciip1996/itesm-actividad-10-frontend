import React from "react";
import { Input } from "@atoms/Input";
import "./FormField.scss";

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children?: React.ReactNode;
  htmlFor?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children,
  htmlFor,
}) => {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={htmlFor}>
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>
      <div className="form-field__input">{children}</div>
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
};

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "date" | "time";
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  id,
  required,
  type = "text",
  ...inputProps
}) => {
  return (
    <FormField label={label} error={error} required={required} htmlFor={id}>
      <Input id={id} type={type} error={!!error} {...inputProps} />
    </FormField>
  );
};
