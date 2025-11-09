import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Language, Translations } from "./types";
import { es } from "./es";
import { en } from "./en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations: Record<Language, Translations> = {
  es,
  en,
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Obtener idioma del localStorage o usar español por defecto
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "es";
  });

  // Guardar idioma en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("language", language);
    // Actualizar el atributo lang del HTML
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
