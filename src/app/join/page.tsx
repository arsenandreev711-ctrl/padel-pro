import { getLang } from "@/lib/lang";
import { hasSupabase } from "@/lib/supabase/server";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";
import { RatingScale } from "@/components/RatingScale";

export const dynamic = "force-dynamic";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await getLang();
  const params = await searchParams;

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex flex-col gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-green" /> Анкета новичка
          <span className="w-1.5 h-1.5 rounded-full bg-burgundy" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold display">
          Определи свой уровень
        </h1>
        <p className="text-ink-soft max-w-2xl">
          Ответь на несколько вопросов об опыте в паделе и теннисе — мы рассчитаем
          твой стартовый уровень и рейтинг. Дальше он будет уточняться по
          результатам матчей.
        </p>
      </div>

      {params.error === "nodb" && (
        <p className="bg-burgundy/10 text-burgundy rounded-xl p-4 text-sm">
          База данных ещё не подключена — профиль пока нельзя сохранить, но уровень
          рассчитывается сразу.
        </p>
      )}
      {params.error === "data" && (
        <p className="bg-burgundy/10 text-burgundy rounded-xl p-4 text-sm">
          Укажи имя и выбери хотя бы один вид спорта.
        </p>
      )}

      <QuestionnaireForm hasDb={hasSupabase()} />

      <div className="grid md:grid-cols-2 gap-5">
        <RatingScale sport="padel" />
        <RatingScale sport="tennis" />
      </div>
    </div>
  );
}
