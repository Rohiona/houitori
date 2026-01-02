"use client";

import { I18nProvider } from "@/modules/presentation/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
