import { MetadataRoute } from "next";
import { udalosti } from "@data/news";
import { pripravovane_akce } from "@data/events";

const SITE_URL = "https://sdhporin.cz";

function latestDateFrom(
  items: { date: { day: number; month: number; year: number } }[],
): Date {
  if (!items.length) return new Date();
  const ts = items.map(
    (i) => new Date(i.date.year, i.date.month - 1, i.date.day).getTime(),
  );
  return new Date(Math.max(...ts));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastNews = latestDateFrom(udalosti);
  const lastEvents = latestDateFrom(pripravovane_akce);
  const lastModified = new Date(
    Math.max(lastNews.getTime(), lastEvents.getTime()),
  );

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/#udalosti`,
      lastModified: lastNews,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#akce`,
      lastModified: lastEvents,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#o-nas`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/#kontakt`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
