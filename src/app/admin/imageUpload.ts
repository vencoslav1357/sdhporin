// Klientská příprava fotek pro admin panel: zmenšení + komprese do JPEG
// a nahrání na server jako git blob (commit vznikne až při uložení).

export interface UploadedImage {
  /** Cesta relativní k public/images/ — tak se ukládá do dat. */
  path: string;
  /** Plná cesta v repozitáři — pro commit. */
  repoPath: string;
  blobSha: string;
  /** Lokální náhled (fotka na webu bude až po nasazení). */
  dataUrl: string;
}

const MAX_SIDE = 1600;
const JPEG_QUALITY = 0.8;

function slugify(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  const slug = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "foto";
}

async function compressToJpeg(
  file: File,
): Promise<{ base64: string; dataUrl: string }> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      `Soubor „${file.name}" se nepodařilo načíst — použij JPEG, PNG nebo WebP.`,
    );
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Nepodařilo se zpracovat obrázek.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return { base64: dataUrl.split(",")[1], dataUrl };
}

/** Zkomprimuje fotku a nahraje ji na server. Vrátí odkaz pro data i commit. */
export async function uploadImage(file: File): Promise<UploadedImage> {
  const { base64, dataUrl } = await compressToJpeg(file);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: base64 }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error ?? "Nahrání fotky se nepovedlo.");
  }

  const year = new Date().getFullYear();
  const path = `upload/${year}/${Date.now()}-${slugify(file.name)}.jpeg`;
  return {
    path,
    repoPath: `public/images/${path}`,
    blobSha: body.sha,
    dataUrl,
  };
}

/** URL náhledu: nové fotky mají dataUrl, existující jsou na webu. */
export function imagePreviewSrc(image: {
  path: string;
  dataUrl?: string;
}): string {
  return image.dataUrl ?? `/images/${image.path}`;
}
