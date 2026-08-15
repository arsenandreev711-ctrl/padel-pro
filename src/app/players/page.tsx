import { getAllPlayers, getRatings } from "@/lib/data";
import { grade } from "@/lib/grading";
import { PlayersDirectory, type DirRow } from "@/components/PlayersDirectory";
import type { Sport } from "@/lib/types";

export const dynamic = "force-dynamic";

function gradeText(sport: Sport, elo: number) {
  const g = grade(sport, elo);
  return {
    text:
      sport === "padel" ? `${g.tier.label} · ${g.level.toFixed(1)}` : g.level.toFixed(1),
    color: g.tier.color,
  };
}

export default async function PlayersPage() {
  const [players, padel, tennis] = await Promise.all([
    getAllPlayers(),
    getRatings("padel", 1000),
    getRatings("tennis", 1000),
  ]);

  const padelMap = new Map(padel.map((r) => [r.player_id, r.rating]));
  const tennisMap = new Map(tennis.map((r) => [r.player_id, r.rating]));

  const rows: DirRow[] = players.map((p) => ({
    id: p.id,
    name: p.full_name,
    city: p.city,
    avatar: p.avatar_url ?? null,
    padel: padelMap.has(p.id) ? gradeText("padel", padelMap.get(p.id)!) : null,
    tennis: tennisMap.has(p.id) ? gradeText("tennis", tennisMap.get(p.id)!) : null,
  }));

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl sm:text-5xl font-bold display">Игроки</h1>
        <p className="text-ink-soft">
          Всё падел- и теннис-сообщество Кыргызстана · {rows.length}
        </p>
      </div>
      <PlayersDirectory rows={rows} />
    </div>
  );
}
