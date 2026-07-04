// Serverová validace dat přicházejících z admin panelu.
// Vrací chybovou hlášku (česky), nebo null když je vše v pořádku.

import type { EventDate, EventItem, NewsItem } from "@data/types";

const MAX_TITLE = 200;
const MAX_TEXT = 20_000;
const MAX_ITEMS = 500;
const MAX_GALLERY = 100;

// Cesty obrázků relativně k public/images/ — bez lomítka na začátku,
// bez ".." a jen bezpečné znaky.
const IMAGE_PATH_RE = /^[\w./-]+\.(jpe?g|png|webp|gif)$/i;

function isSafeImagePath(path: string): boolean {
  return (
    IMAGE_PATH_RE.test(path) && !path.includes("..") && !path.startsWith("/")
  );
}

// Nové soubory smí přibývat jen do public/images/upload/<rok>/…
const UPLOAD_REPO_PATH_RE =
  /^public\/images\/upload\/\d{4}\/[\w-]+\.(jpe?g|png|webp)$/i;

export function isSafeUploadRepoPath(path: string): boolean {
  return UPLOAD_REPO_PATH_RE.test(path) && !path.includes("..");
}

function validDate(date: unknown): date is EventDate {
  if (typeof date !== "object" || date === null) return false;
  const d = date as EventDate;
  return (
    Number.isInteger(d.day) &&
    d.day >= 1 &&
    d.day <= 31 &&
    Number.isInteger(d.month) &&
    d.month >= 1 &&
    d.month <= 12 &&
    Number.isInteger(d.year) &&
    d.year >= 2000 &&
    d.year <= 2100
  );
}

function validText(value: unknown, max: number): value is string {
  return typeof value === "string" && value.length <= max;
}

export function validateEventItems(items: unknown): string | null {
  if (!Array.isArray(items) || items.length > MAX_ITEMS) {
    return "Neplatný seznam akcí.";
  }
  for (const item of items as EventItem[]) {
    if (typeof item !== "object" || item === null) return "Neplatná akce.";
    if (!validDate(item.date)) return `Akce „${item.title}": neplatné datum.`;
    if (!validText(item.title, MAX_TITLE) || !item.title.trim()) {
      return "Každá akce musí mít název.";
    }
    if (!validText(item.text, MAX_TEXT)) {
      return `Akce „${item.title}": neplatný text.`;
    }
  }
  return null;
}

export function validateNewsItems(items: unknown): string | null {
  if (!Array.isArray(items) || items.length > MAX_ITEMS) {
    return "Neplatný seznam aktualit.";
  }
  for (const item of items as NewsItem[]) {
    if (typeof item !== "object" || item === null) return "Neplatná aktualita.";
    if (!validDate(item.date)) {
      return `Aktualita „${item.title}": neplatné datum.`;
    }
    if (!validText(item.title, MAX_TITLE) || !item.title.trim()) {
      return "Každá aktualita musí mít název.";
    }
    if (!validText(item.preview, MAX_TEXT) || !validText(item.fullText, MAX_TEXT)) {
      return `Aktualita „${item.title}": neplatný text.`;
    }
    if (typeof item.mainImage !== "string" || !isSafeImagePath(item.mainImage)) {
      return `Aktualita „${item.title}": chybí nebo je neplatná hlavní fotka.`;
    }
    if (
      !Array.isArray(item.gallery) ||
      item.gallery.length > MAX_GALLERY ||
      item.gallery.some((g) => typeof g !== "string" || !isSafeImagePath(g))
    ) {
      return `Aktualita „${item.title}": neplatná galerie.`;
    }
  }
  return null;
}
