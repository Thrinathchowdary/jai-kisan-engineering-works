import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTranslation, supportedLanguages } from "../i18n/translations";

const LanguageContext = createContext(null);
const validLanguages = supportedLanguages.map((item) => item.id);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = window.localStorage.getItem("language");
    return validLanguages.includes(saved) ? saved : "en";
  });

  const setLanguage = (nextLanguage) => {
    if (!validLanguages.includes(nextLanguage)) return;
    window.localStorage.setItem("language", nextLanguage);
    setLanguageState(nextLanguage);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (path) => getTranslation(language, path),
      getLocalizedProductName: (product) => product.name,
      getLocalizedDescription: (product) =>
        getTranslation(language, `product.descriptions.${product.id}`) ||
        product.description,
      getLocalizedCategory: (categoryId) =>
        getTranslation(language, `categories.names.${categoryId}`),
      getLocalizedShortCategory: (categoryId) =>
        getTranslation(language, `categories.short.${categoryId}`),
    }),
    [language],
  );

  useEffect(() => {
    const selected = supportedLanguages.find((item) => item.id === language);
    document.documentElement.lang = language;
    document.body.classList.remove("language-en", "language-te", "language-hi");
    document.body.classList.add(selected.fontClass);
    document.title = getTranslation(language, "seo.title");
    const description = document.querySelector('meta[name="description"]');
    if (description)
      description.setAttribute(
        "content",
        getTranslation(language, "seo.description"),
      );
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
