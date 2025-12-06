"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Dictionary, pl, en } from "./dictionaries";

type Language = "pl" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    dictionary: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("pl");

    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang && (savedLang === "pl" || savedLang === "en")) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    const dictionary = language === "pl" ? pl : en;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, dictionary }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
