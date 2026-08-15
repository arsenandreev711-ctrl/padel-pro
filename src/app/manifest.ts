import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MatePoint — падел и теннис Кыргызстана",
    short_name: "MatePoint",
    description:
      "Рейтинг, открытые игры и турниры по паделу и теннису в Кыргызстане. Создавай игры и находи партнёров.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f2ea",
    theme_color: "#f5f2ea",
    lang: "ru",
    categories: ["sports", "social"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
