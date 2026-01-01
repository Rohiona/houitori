import { DirectionForm } from "@/app/components/DirectionForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          九星気学 方位吉凶計算
        </h1>
        <DirectionForm />
      </main>
    </div>
  );
}
