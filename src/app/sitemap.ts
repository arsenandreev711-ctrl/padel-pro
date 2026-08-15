import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://padel-pro-bay.vercel.app";
  const routes = [
    "",
    "/rating",
    "/players",
    "/games",
    "/matches",
    "/tournaments",
    "/courts",
    "/how",
    "/join",
    "/login",
    "/create",
    "/privacy",
  ];
  return routes.map((r) => ({
    url: base + r,
    changeFrequency: "daily",
    priority: r === "" ? 1 : 0.7,
  }));
}
