import React from "react";
import "./Alert.scss";

export type AlertVariant = "success" | "warning" | "error" | "info";

export interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "info",
  onClose,
  className = "",
}) => {
  const classes = ["alert", `alert--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="alert">
      <div className="alert__content">{children}</div>
      {onClose && (
        <button
          className="alert__close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};
