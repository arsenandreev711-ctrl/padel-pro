import { getLang } from "@/lib/lang";
import { getCourts } from "@/lib/data";
import { CreateForm } from "@/components/CreateForm";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string }>;
}) {
  const { t } = await getLang();
  const [courts, me, params] = await Promise.all([getCourts(), currentUser(), searchParams]);
  const tab = params.tab === "tournament" ? "tournament" : "game";

  const errMap: Record<string, string> = {
    name: t.create.errName,
    time: t.create.errTime,
    contact: t.create.errContact,
    db: t.create.errDb,
  };
  const errMsg = params.error ? errMap[params.error] : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl sm:text-5xl font-bold display">{t.create.title}</h1>
        <p className="text-ink-soft max-w-2xl">{t.create.subtitle}</p>
      </div>

      {errMsg && (
        <p className="bg-burgundy/10 text-burgundy rounded-xl p-4 text-sm max-w-2xl">{errMsg}</p>
      )}

      <CreateForm
        courts={courts}
        t={t}
        initialTab={tab}
        meName={me?.full_name ?? ""}
        meContact={me?.phone ?? ""}
      />
    </div>
  );
}
