import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/profile/edit"],
    },
    sitemap: "https://padel-pro-bay.vercel.app/sitemap.xml",
  };
}
