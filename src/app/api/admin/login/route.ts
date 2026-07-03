import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  loginBlockedForMs,
  recordLoginFailure,
  recordLoginSuccess,
  requestIp,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const ip = requestIp(request);

    const blockedMs = loginBlockedForMs(ip);
    if (blockedMs > 0) {
      return NextResponse.json(
        {
          error: `Příliš mnoho pokusů. Zkus to znovu za ${Math.ceil(blockedMs / 1000)} s.`,
        },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    const password = body?.password;
    if (typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Zadej heslo." }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      recordLoginFailure(ip);
      return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
    }

    recordLoginSuccess(ip);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken(),
      sessionCookieOptions(),
    );
    return response;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Neznámá chyba." },
      { status: 500 },
    );
  }
}
