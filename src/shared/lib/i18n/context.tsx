"use client";

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { translations, type Locale } from "./translations";

type TranslationType = (typeof translations)[Locale];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationType;
}

const I18nContext = createContext<I18nContextType | null>(null);

function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return "ja";
  const browserLang = navigator.language.split("-")[0];
  return browserLang === "en" ? "en" : "ja";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ja");
  const initializedRef = useRef(false);

  // クライアント側でブラウザの言語を検出（初回マウント時のみ）
  // ブラウザの言語設定という外部状態との同期なので、useEffect内でのsetStateは正当な使用
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const detectedLocale = detectBrowserLocale();
      if (detectedLocale !== "ja") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocale(detectedLocale);
      }
    }
  }, []);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: translations[locale],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  // Return default Japanese translations if context is not available (e.g., during static generation)
  if (!context) {
    return {
      locale: "ja" as Locale,
      setLocale: () => {},
      t: translations.ja,
    };
  }
  return context;
}

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "ja" ? "en" : "ja")}
      className="px-3 py-1 text-sm border rounded-md hover:bg-accent cursor-pointer"
    >
      {locale === "ja" ? "English" : "日本語"}
    </button>
  );
}
