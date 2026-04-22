import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SDH Pořín – Sbor dobrovolných hasičů Pořín",
    short_name: "SDH Pořín",
    description:
      "Sbor dobrovolných hasičů Pořín – aktuality, kalendář akcí a kontakt.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    lang: "cs-CZ",
    dir: "ltr",
    categories: ["community", "lifestyle", "social"],
    icons: [
      {
        src: "/images/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
