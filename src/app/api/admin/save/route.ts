import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";
import { commitFiles, getFile, type CommitFile } from "@/lib/github";
import {
  isSafeUploadRepoPath,
  validateEventItems,
  validateNewsItems,
} from "@/lib/adminValidate";

export const dynamic = "force-dynamic";

const MAX_NEW_FILES = 60;

interface SavePayload {
  news?: unknown;
  events?: unknown;
  newFiles?: { path: string; blobSha: string }[];
  baseShas?: { news?: string; events?: string };
  message?: string;
}

function serialize(items: unknown): string {
  return JSON.stringify(items, null, 2) + "\n";
}

// Uloží změny jako jeden commit na GitHub (data + nově nahrané fotky).
export async function POST(request: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });
    }

    const body: SavePayload | null = await request.json().catch(() => null);
    if (!body || (body.news === undefined && body.events === undefined)) {
      return NextResponse.json({ error: "Není co uložit." }, { status: 400 });
    }

    const files: CommitFile[] = [];

    if (body.news !== undefined) {
      const error = validateNewsItems(body.news);
      if (error) return NextResponse.json({ error }, { status: 400 });
      files.push({ path: "data/news.json", content: serialize(body.news) });
    }
    if (body.events !== undefined) {
      const error = validateEventItems(body.events);
      if (error) return NextResponse.json({ error }, { status: 400 });
      files.push({ path: "data/events.json", content: serialize(body.events) });
    }

    const newFiles = body.newFiles ?? [];
    if (!Array.isArray(newFiles) || newFiles.length > MAX_NEW_FILES) {
      return NextResponse.json(
        { error: "Neplatný seznam nahraných souborů." },
        { status: 400 },
      );
    }
    for (const file of newFiles) {
      if (
        typeof file?.path !== "string" ||
        typeof file?.blobSha !== "string" ||
        !/^[0-9a-f]{40}$/.test(file.blobSha) ||
        !isSafeUploadRepoPath(file.path)
      ) {
        return NextResponse.json(
          { error: `Neplatná cesta nahraného souboru: ${file?.path ?? "?"}` },
          { status: 400 },
        );
      }
      files.push({ path: file.path, blobSha: file.blobSha });
    }

    // Detekce konfliktu: data na GitHubu se nesmí lišit od verze,
    // kterou panel načetl.
    const checks: [string, string | undefined][] = [];
    if (body.news !== undefined) {
      checks.push(["data/news.json", body.baseShas?.news]);
    }
    if (body.events !== undefined) {
      checks.push(["data/events.json", body.baseShas?.events]);
    }
    for (const [path, baseSha] of checks) {
      const current = await getFile(path);
      if (!baseSha || current.sha !== baseSha) {
        return NextResponse.json(
          {
            error:
              "Data se mezitím změnila (uloženo odjinud). Obnov si data a úpravu proveď znovu.",
          },
          { status: 409 },
        );
      }
    }

    const message =
      typeof body.message === "string" && body.message.trim()
        ? body.message.trim().slice(0, 200)
        : "Admin: úprava obsahu webu";

    const commitSha = await commitFiles(message, files);
    return NextResponse.json({ ok: true, commitSha });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Neznámá chyba." },
      { status: 500 },
    );
  }
}
