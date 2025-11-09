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
  // Get language from localStorage or use Spanish as default
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "es";
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
    // Update the lang attribute of the HTML element
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
