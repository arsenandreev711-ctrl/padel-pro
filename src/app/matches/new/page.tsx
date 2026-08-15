import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPlayers } from "@/lib/data";
import { currentUser } from "@/lib/auth";
import { MatchForm } from "@/components/MatchForm";

export const dynamic = "force-dynamic";

export default async function NewMatchPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const [players, params] = await Promise.all([getAllPlayers(), searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/matches"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors w-fit"
      >
        <ArrowLeft size={15} /> Матчи
      </Link>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl sm:text-5xl font-bold display">Записать матч</h1>
        <p className="text-ink-soft max-w-xl">
          Внеси результат сыгранного матча — рейтинг всех участников обновится автоматически.
        </p>
      </div>

      {params.error && (
        <p className="bg-burgundy/10 text-burgundy rounded-xl p-3 text-sm max-w-lg">
          Проверь состав команд (без повторов) и счёт.
        </p>
      )}

      <MatchForm
        players={players.map((p) => ({ id: p.id, full_name: p.full_name }))}
        meId={me.id}
      />
    </div>
  );
}
