import { getLang } from "@/lib/lang";
import { hasSupabase } from "@/lib/supabase/server";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";
import { RatingScale } from "@/components/RatingScale";
import { currentUser } from "@/lib/auth";
import { createPlayer, setMyLevel } from "@/app/players/actions";

export const dynamic = "force-dynamic";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await getLang();
  const [params, me] = await Promise.all([searchParams, currentUser()]);
  const loggedIn = !!me;

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex flex-col gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-green" /> Анкета новичка
          <span className="w-1.5 h-1.5 rounded-full bg-burgundy" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold display">
          {loggedIn ? "Определи свой уровень" : "Определи свой уровень"}
        </h1>
        <p className="text-ink-soft max-w-2xl">
          {loggedIn
            ? `${me!.full_name}, выбери свой вид спорта (падел, теннис или оба) и ответь на пару вопросов об опыте — рассчитаем твой стартовый рейтинг и добавим в таблицу. Дальше он уточняется по матчам.`
            : "Выбери свой вид спорта (падел, теннис или оба) и ответь на пару вопросов об опыте — рассчитаем твой стартовый уровень и рейтинг. Дальше он уточняется по результатам матчей."}
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

      <QuestionnaireForm
        hasDb={hasSupabase()}
        loggedIn={loggedIn}
        submitAction={loggedIn ? setMyLevel : createPlayer}
      />

      <div className="grid md:grid-cols-2 gap-5">
        <RatingScale sport="padel" />
        <RatingScale sport="tennis" />
      </div>
    </div>
  );
}
