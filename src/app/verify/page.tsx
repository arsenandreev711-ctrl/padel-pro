import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { botUsername } from "@/lib/telegram";
import { VerifyClient } from "@/components/VerifyClient";

export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const { token } = await searchParams;
  if (!token) redirect(`/players/${me.id}`);

  const username = await botUsername();
  const link = username ? `https://t.me/${username}?start=${token}` : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold display">Подтверждение номера</h1>
        <p className="text-ink-soft max-w-md">
          Подтверди свой номер через Telegram — это бесплатно и занимает пару секунд.
        </p>
      </div>
      <VerifyClient token={token} link={link} playerId={me.id} />
    </div>
  );
}
