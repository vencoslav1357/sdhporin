// Klient GitHub API pro admin panel: čtení datových souborů a atomický
// zápis změn (blob → tree → commit → posun refu) do větve.

const API = "https://api.github.com";

function repo(): string {
  return process.env.GITHUB_REPO ?? "vencoslav1357/sdhporin";
}

function branch(): string {
  return process.env.GITHUB_BRANCH ?? "main";
}

function token(required: boolean): string | undefined {
  const t = process.env.GITHUB_TOKEN;
  if (!t && required) {
    throw new Error(
      "Chybí konfigurace GITHUB_TOKEN (nastav ho v .env.local nebo na Vercelu).",
    );
  }
  return t;
}

async function ghFetch(path: string, init?: RequestInit): Promise<any> {
  // Zápis vyžaduje token; čtení veřejného repa funguje i bez něj.
  const t = token(init?.method !== undefined && init.method !== "GET");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status} na ${path}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

export interface RepoFile {
  content: string;
  sha: string;
}

/** Načte textový soubor z repozitáře (aktuální stav větve). */
export async function getFile(path: string): Promise<RepoFile> {
  const data = await ghFetch(
    `/repos/${repo()}/contents/${path}?ref=${branch()}`,
  );
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

/** Nahraje binární obsah jako git blob (bez commitu). Vrátí SHA blobu. */
export async function createBlob(base64Content: string): Promise<string> {
  const data = await ghFetch(`/repos/${repo()}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({ content: base64Content, encoding: "base64" }),
  });
  return data.sha;
}

export interface CommitFile {
  path: string;
  /** Textový obsah (pro JSON data)… */
  content?: string;
  /** …nebo SHA už nahraného blobu (pro obrázky). */
  blobSha?: string;
}

/**
 * Vytvoří na větvi jeden commit se zadanými soubory. Ref se posouvá bez
 * force až na konci — při souběžné změně GitHub zápis odmítne a nic se
 * nepoškodí.
 */
export async function commitFiles(
  message: string,
  files: CommitFile[],
): Promise<string> {
  const r = repo();
  const ref = await ghFetch(`/repos/${r}/git/ref/heads/${branch()}`);
  const headSha: string = ref.object.sha;
  const headCommit = await ghFetch(`/repos/${r}/git/commits/${headSha}`);

  const tree = await ghFetch(`/repos/${r}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: headCommit.tree.sha,
      tree: files.map((f) => ({
        path: f.path,
        mode: "100644",
        type: "blob",
        ...(f.blobSha ? { sha: f.blobSha } : { content: f.content }),
      })),
    }),
  });

  const commit = await ghFetch(`/repos/${r}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [headSha],
    }),
  });

  await ghFetch(`/repos/${r}/git/refs/heads/${branch()}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return commit.sha;
}
