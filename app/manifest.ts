import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fridge Chef",
    short_name: "FridgeChef",
    description: "Rezepte aus deinen vorhandenen Zutaten — 3 bewusst unterschiedliche Ideen.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ef",
    theme_color: "#315343",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
