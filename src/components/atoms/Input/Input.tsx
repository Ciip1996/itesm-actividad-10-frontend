import React from "react";
import "./Input.scss";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "date"
  | "time";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputType;
  error?: boolean;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  error = false,
  fullWidth = true,
  className = "",
  ...props
}) => {
  const classes = [
    "input",
    error && "input--error",
    fullWidth && "input--full-width",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <input type={type} className={classes} {...props} />;
};
