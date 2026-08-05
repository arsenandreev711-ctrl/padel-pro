import { getLang } from "@/lib/lang";
import { getRatings } from "@/lib/data";
import { RatingTable } from "@/components/RatingTable";
import { SportTabs } from "@/components/SportTabs";
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
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold display">{t.ratingTitle}</h1>
      <SportTabs active={sport} base="/rating" t={t} />
      <RatingTable ratings={ratings} t={t} />
    </div>
  );
}
