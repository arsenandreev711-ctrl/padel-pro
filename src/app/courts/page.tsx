import { MapPin } from "lucide-react";
import { getLang } from "@/lib/lang";
import { getCourts } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import type { Court, Sport } from "@/lib/types";

export const revalidate = 60;

function CourtCard({ court, address }: { court: Court; address: string }) {
  return (
    <div className="lift rounded-2xl border border-line bg-surface p-5 flex flex-col gap-2">
      <h3 className="display text-lg font-bold leading-tight">{court.name}</h3>
      {court.address && (
        <p className="text-sm text-ink-soft flex items-start gap-1.5">
          <MapPin size={15} className="mt-0.5 shrink-0 text-ink-soft/60" />
          <span>{court.address}</span>
        </p>
      )}
      <span className="text-xs text-ink-soft/70 mt-auto pt-1">{court.city}</span>
    </div>
  );
}

export default async function CourtsPage() {
  const { t } = await getLang();
  const courts = await getCourts();

  const bySport = (sport: Sport) =>
    courts.filter((c) => c.sports.includes(sport));

  const groups: { sport: Sport; label: string; dot: string; list: Court[] }[] = [
    { sport: "padel", label: t.padelCourts, dot: "bg-green", list: bySport("padel") },
    { sport: "tennis", label: t.tennisCourts, dot: "bg-burgundy", list: bySport("tennis") },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl sm:text-5xl font-bold display">{t.courtsTitle}</h1>
        <p className="text-ink-soft">{t.courtsText}</p>
      </div>

      {groups.map((g, gi) => (
        <section key={g.sport} className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${g.dot}`} />
            <h2 className="text-2xl sm:text-3xl font-bold display">{g.label}</h2>
            <span className="text-ink-soft/60 text-sm font-medium">{g.list.length}</span>
          </div>
          {g.list.length === 0 ? (
            <p className="text-ink-soft">{t.noData}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {g.list.map((c, i) => (
                <Reveal key={c.id} delay={(gi * g.list.length + i) * 50}>
                  <CourtCard court={c} address={t.address} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
