import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLang } from "@/lib/lang";
import { getRatings } from "@/lib/data";
import { RatingTable } from "@/components/RatingTable";
import { SportTabs } from "@/components/SportTabs";
import { RatingScale } from "@/components/RatingScale";
import type { Sport } from "@/lib/types";

export const revalidate = 60;

export default async function RatingPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const { t } = await getLang();
  const params = await searchParams;
  const sport: Sport = params.sport === "tennis" ? "tennis" : "padel";
  const ratings = await getRatings(sport);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl sm:text-5xl font-bold display">{t.ratingTitle}</h1>
        <p className="text-ink-soft">{t.tagline}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SportTabs active={sport} base="/rating" t={t} />
        <div className="flex items-center gap-4">
          <Link
            href="/players"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors cursor-pointer"
          >
            Все игроки <ArrowRight size={15} />
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:text-green-deep transition-colors duration-200 cursor-pointer"
          >
            Новичок? Пройди анкету <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <RatingTable ratings={ratings} t={t} />

      <div className="mt-4">
        <RatingScale sport={sport} />
      </div>
    </div>
  );
}
