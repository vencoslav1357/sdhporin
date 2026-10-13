// Sdílené pomůcky admin panelu.

import type { EventDate } from "@data/types";

export const MONTHS_SHORT = [
  "Led",
  "Úno",
  "Bře",
  "Dub",
  "Kvě",
  "Čvn",
  "Čvc",
  "Srp",
  "Zář",
  "Říj",
  "Lis",
  "Pro",
];

export function dateMs(date: EventDate): number {
  return new Date(date.year, date.month - 1, date.day).getTime();
}

export function formatDate(date: EventDate): string {
  return `${date.day}. ${date.month}. ${date.year}`;
}

/** Datum z formuláře; vrátí null, když neexistuje (např. 31. 2.). */
export function parseDate(
  day: string,
  month: string,
  year: string,
): EventDate | null {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) {
    return null;
  }
  const check = new Date(y, m - 1, d);
  if (
    y < 2000 ||
    y > 2100 ||
    check.getFullYear() !== y ||
    check.getMonth() !== m - 1 ||
    check.getDate() !== d
  ) {
    return null;
  }
  return { day: d, month: m, year: y };
}

// Jednotné styly formulářových prvků a tlačítek.
export const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100";
export const labelCls = "mb-1.5 block text-sm font-medium text-gray-700";
export const btnPrimaryCls =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-50";
export const btnSecondaryCls =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";
