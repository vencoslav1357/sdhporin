// Autentizace admin panelu: ověření hesla (ADMIN_PASSWORD), podepsané
// session cookie a jednoduchý rate limit přihlašování.

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_S = 7 * 24 * 60 * 60; // 7 dní

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

function adminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error(
      "Chybí konfigurace ADMIN_PASSWORD (nastav ji v .env.local nebo na Vercelu).",
    );
  }
  return pw;
}

// Klíč pro podpis session se derivuje z hesla — změna hesla zneplatní
// všechny přihlášené session.
function sessionKey(): Buffer {
  return createHash("sha256")
    .update(`sdhporin-admin-session:${adminPassword()}`)
    .digest();
}

function sign(payload: string): string {
  return createHmac("sha256", sessionKey()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function verifyPassword(password: string): boolean {
  return safeEqual(password, adminPassword());
}

export function createSessionToken(): string {
  const exp = Date.now() + SESSION_MAX_AGE_S * 1000;
  return `${exp}.${sign(String(exp))}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expStr, signature] = token.split(".");
  if (!expStr || !signature) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return safeEqual(signature, sign(expStr));
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  };
}

/** Vrátí true, když má aktuální request platnou admin session. */
export function isAuthenticated(): boolean {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
}

// Rate limit přihlašování: po několika neúspěších krátká blokace dle IP.
// In-memory — na serverless best-effort, pro malý web dostačující.
const failedAttempts = new Map<string, { count: number; blockedUntil: number }>();

export function loginBlockedForMs(ip: string): number {
  const entry = failedAttempts.get(ip);
  if (!entry) return 0;
  return Math.max(0, entry.blockedUntil - Date.now());
}

export function recordLoginFailure(ip: string): void {
  const entry = failedAttempts.get(ip) ?? { count: 0, blockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    entry.blockedUntil = Date.now() + LOCKOUT_MS;
    entry.count = 0;
  }
  failedAttempts.set(ip, entry);
}

export function recordLoginSuccess(ip: string): void {
  failedAttempts.delete(ip);
}

export function requestIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}
