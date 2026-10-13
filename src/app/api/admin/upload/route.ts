import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";
import { createBlob } from "@/lib/github";

export const dynamic = "force-dynamic";

const MAX_BYTES = 3 * 1024 * 1024; // po klientské kompresi bohatě stačí

// Magic bytes povolených formátů.
function looksLikeImage(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true; // JPEG
  if (buf.subarray(0, 8).equals(Buffer.from("\x89PNG\r\n\x1a\n", "binary"))) {
    return true; // PNG
  }
  return (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

// Přijme jeden obrázek (base64) a nahraje ho jako git blob — commit
// vznikne až při uložení, takže osiřelé bloby nic nerozbijí.
export async function POST(request: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const data = body?.data;
    if (typeof data !== "string" || !data) {
      return NextResponse.json({ error: "Chybí obrázek." }, { status: 400 });
    }

    const buf = Buffer.from(data, "base64");
    if (buf.length > MAX_BYTES) {
      return NextResponse.json(
        { error: "Obrázek je příliš velký (max 3 MB)." },
        { status: 413 },
      );
    }
    if (!looksLikeImage(buf)) {
      return NextResponse.json(
        { error: "Soubor není podporovaný obrázek (JPEG/PNG/WebP)." },
        { status: 400 },
      );
    }

    const sha = await createBlob(data);
    return NextResponse.json({ sha });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Neznámá chyba." },
      { status: 500 },
    );
  }
}
