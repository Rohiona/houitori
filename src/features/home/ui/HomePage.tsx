"use client";

import { useI18n, LanguageToggle } from "@/shared/lib/i18n";
import { DirectionForm } from "@/features/directions/search";
import { HelpDialog } from "./HelpDialog";
import { ShareButtons } from "./ShareButtons";

export function HomePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black select-none">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t.pageTitle}</h1>
          <LanguageToggle />
        </div>
        <div className="mb-8">
          <HelpDialog />
        </div>
        <DirectionForm />
        <ShareButtons />
      </main>
    </div>
  );
}
