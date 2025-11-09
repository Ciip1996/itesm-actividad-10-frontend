import React from "react";
import { useLanguage } from "@/i18n";
import type { Language } from "@/i18n";
import "./LanguageSwitch.scss";

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleToggle = () => {
    const newLang: Language = language === "es" ? "en" : "es";
    setLanguage(newLang);
  };

  return (
    <button
      className="language-switch"
      onClick={handleToggle}
      aria-label={`Switch to ${language === "es" ? "English" : "Español"}`}
      title={`Switch to ${language === "es" ? "English" : "Español"}`}
    >
      <span
        className={`language-switch__option ${
          language === "es" ? "language-switch__option--active" : ""
        }`}
      >
        ES
      </span>
      <span className="language-switch__divider">/</span>
      <span
        className={`language-switch__option ${
          language === "en" ? "language-switch__option--active" : ""
        }`}
      >
        EN
      </span>
    </button>
  );
};
