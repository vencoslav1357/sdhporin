import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";
import { getFile } from "@/lib/github";

export const dynamic = "force-dynamic";

// Vrátí aktuální data přímo z GitHubu (ne z buildu), včetně SHA souborů
// pro pozdější detekci konfliktu při ukládání.
export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });
    }

    const [news, events] = await Promise.all([
      getFile("data/news.json"),
      getFile("data/events.json"),
    ]);

    return NextResponse.json({
      news: JSON.parse(news.content),
      events: JSON.parse(events.content),
      shas: { news: news.sha, events: events.sha },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Neznámá chyba." },
      { status: 500 },
    );
  }
}
