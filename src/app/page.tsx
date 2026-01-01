import { DirectionForm } from "@/app/components/DirectionForm";
import { HelpDialogWrapper } from "@/app/components/HelpDialogWrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black select-none">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          九星気学 方位吉凶計算
        </h1>
        <div className="mb-8">
          <HelpDialogWrapper />
        </div>
        <DirectionForm />
      </main>
    </div>
  );
}
