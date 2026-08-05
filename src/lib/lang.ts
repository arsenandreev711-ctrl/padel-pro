import { cookies } from "next/headers";
import { getDict, type Lang } from "./i18n";

export async function getLang() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value === "ky" ? "ky" : "ru") as Lang;
  return { lang, t: getDict(lang) };
}
