import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { ProfileEditForm } from "@/components/ProfileEditForm";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const params = await searchParams;

  const nameParts = (me.full_name || "").split(" ");
  const first = nameParts[0] || "";
  const last = nameParts.slice(1).join(" ");

  const errMap: Record<string, string> = {
    name: "Укажи имя.",
    phone: "Проверь номер телефона.",
    phonetaken: "Этот номер уже занят другим аккаунтом.",
    db: "Не удалось сохранить. Попробуй ещё раз.",
  };
  const errMsg = params.error ? errMap[params.error] : null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/players/${me.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors w-fit"
      >
        <ArrowLeft size={15} /> В профиль
      </Link>
      <h1 className="text-4xl sm:text-5xl font-bold display">Редактировать профиль</h1>

      {errMsg && (
        <p className="bg-burgundy/10 text-burgundy rounded-xl p-3 text-sm max-w-md">{errMsg}</p>
      )}

      <ProfileEditForm
        initialFirst={first}
        initialLast={last}
        initialCity={me.city || "Бишкек"}
        initialPhone={me.phone || ""}
        initialAvatar={me.avatar_url ?? null}
      />
    </div>
  );
}
