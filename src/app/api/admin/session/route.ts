import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ authenticated: isAuthenticated() });
  } catch {
    // Chybějící ADMIN_PASSWORD apod. — bez konfigurace nikdo přihlášen není.
    return NextResponse.json({ authenticated: false });
  }
}
