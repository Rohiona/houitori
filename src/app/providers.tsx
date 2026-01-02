"use client";

import type { ReactNode } from "react";

import { I18nProvider } from "@/app/lib/i18n";

export function Providers({ children }: { children: ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
