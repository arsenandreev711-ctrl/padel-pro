import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string; phone?: string }>;
}) {
  const user = await currentUser();
  if (user) redirect("/players/" + user.id);

  const params = await searchParams;
  const tab = params.tab === "register" ? "register" : "login";

  const errMap: Record<string, string> = {
    phone: "Проверь номер телефона.",
    name: "Укажи имя.",
    notfound: "Аккаунт с таким номером не найден — зарегистрируйся.",
    db: "Не удалось сохранить. Попробуй ещё раз.",
  };
  const errMsg = params.error ? errMap[params.error] : null;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold display">Вход в MatePoint</h1>
        <p className="text-ink-soft max-w-md">
          Войди по номеру телефона, чтобы создавать игры, записываться к другим и
          вести свой профиль и рейтинг.
        </p>
      </div>

      {errMsg && (
        <p className="bg-burgundy/10 text-burgundy rounded-xl p-3 text-sm max-w-md w-full text-center">
          {errMsg}
        </p>
      )}

      <AuthForm initialTab={tab} initialPhone={params.phone || ""} />
    </div>
  );
}
