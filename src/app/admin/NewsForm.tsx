"use client";

import { useRef, useState } from "react";
import type { NewsItem } from "@data/types";
import DateFields from "./DateFields";
import {
  imagePreviewSrc,
  uploadImage,
  type UploadedImage,
} from "./imageUpload";
import {
  btnPrimaryCls,
  btnSecondaryCls,
  inputCls,
  labelCls,
  parseDate,
} from "./shared";

interface GalleryImage {
  path: string;
  dataUrl?: string;
}

export interface NewsSaveResult {
  item: NewsItem;
  newFiles: { path: string; blobSha: string }[];
}

interface Props {
  initial: NewsItem | null;
  saving: boolean;
  onSave: (result: NewsSaveResult) => void;
  onCancel: () => void;
}

const ACCEPT = "image/jpeg,image/png,image/webp";

export default function NewsForm({ initial, saving, onSave, onCancel }: Props) {
  const [day, setDay] = useState(initial ? String(initial.date.day) : "");
  const [month, setMonth] = useState(initial ? String(initial.date.month) : "");
  const [year, setYear] = useState(
    initial ? String(initial.date.year) : String(new Date().getFullYear()),
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [preview, setPreview] = useState(initial?.preview ?? "");
  const [fullText, setFullText] = useState(initial?.fullText ?? "");
  const [mainImage, setMainImage] = useState<GalleryImage | null>(
    initial ? { path: initial.mainImage } : null,
  );
  const [gallery, setGallery] = useState<GalleryImage[]>(
    initial ? initial.gallery.map((path) => ({ path })) : [],
  );
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState<"main" | "gallery" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  function handleDate(field: "day" | "month" | "year", value: string) {
    if (field === "day") setDay(value);
    else if (field === "month") setMonth(value);
    else setYear(value);
  }

  async function handleMainUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading("main");
    setError(null);
    try {
      const uploaded = await uploadImage(files[0]);
      setUploads((prev) => [...prev, uploaded]);
      setMainImage({ path: uploaded.path, dataUrl: uploaded.dataUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nahrání fotky se nepovedlo.");
    } finally {
      setUploading(null);
      if (mainInputRef.current) mainInputRef.current.value = "";
    }
  }

  async function handleGalleryUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading("gallery");
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await uploadImage(file);
        setUploads((prev) => [...prev, uploaded]);
        setGallery((prev) => [
          ...prev,
          { path: uploaded.path, dataUrl: uploaded.dataUrl },
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nahrání fotky se nepovedlo.");
    } finally {
      setUploading(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  function moveGalleryImage(index: number, delta: -1 | 1) {
    setGallery((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeGalleryImage(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const date = parseDate(day, month, year);
    if (!date) {
      setError("Zadané datum neexistuje — zkontroluj den, měsíc a rok.");
      return;
    }
    if (!title.trim()) {
      setError("Vyplň název aktuality.");
      return;
    }
    if (!mainImage) {
      setError("Nahraj hlavní fotku — zobrazuje se na kartě aktuality.");
      return;
    }
    setError(null);

    // Do commitu jdou jen nahrané fotky, které jsou stále použité
    // (hlavní fotka nebo galerie) — zahozené náhledy se necommitují.
    const usedPaths = new Set([mainImage.path, ...gallery.map((g) => g.path)]);
    const newFiles = uploads
      .filter((u) => usedPaths.has(u.path))
      .map((u) => ({ path: u.repoPath, blobSha: u.blobSha }));

    onSave({
      item: {
        date,
        title: title.trim(),
        mainImage: mainImage.path,
        preview: preview.trim(),
        fullText: fullText.trim(),
        gallery: gallery.map((g) => g.path),
      },
      newFiles,
    });
  }

  const busy = saving || uploading !== null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-xl font-bold text-gray-900">
        {initial ? "Upravit aktualitu" : "Nová aktualita"}
      </h3>

      <DateFields day={day} month={month} year={year} onChange={handleDate} />

      <div>
        <label htmlFor="news-title" className={labelCls}>
          Název
        </label>
        <input
          id="news-title"
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
          placeholder="Např. Dětský karneval"
        />
      </div>

      <div>
        <label htmlFor="news-preview" className={labelCls}>
          Krátký popis <span className="font-normal text-gray-400">(zobrazí se na kartě pod názvem)</span>
        </label>
        <textarea
          id="news-preview"
          rows={2}
          maxLength={500}
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          className={inputCls}
          placeholder="Jedna dvě věty, které lákají k rozkliknutí."
        />
      </div>

      <div>
        <label htmlFor="news-fulltext" className={labelCls}>
          Plný text <span className="font-normal text-gray-400">(zobrazí se po rozkliknutí)</span>
        </label>
        <textarea
          id="news-fulltext"
          rows={7}
          value={fullText}
          onChange={(e) => setFullText(e.target.value)}
          className={inputCls}
          placeholder="Celý popis události."
        />
      </div>

      {/* Hlavní fotka */}
      <div>
        <span className={labelCls}>Hlavní fotka</span>
        <div className="flex flex-wrap items-center gap-4">
          {mainImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePreviewSrc(mainImage)}
              alt="Náhled hlavní fotky"
              className="h-24 w-32 rounded-xl border border-gray-200 object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => mainInputRef.current?.click()}
            disabled={busy}
            className={btnSecondaryCls}
          >
            {uploading === "main"
              ? "Nahrávám…"
              : mainImage
                ? "Vyměnit fotku"
                : "Nahrát fotku"}
          </button>
          <input
            ref={mainInputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleMainUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Galerie */}
      <div>
        <span className={labelCls}>
          Galerie{" "}
          <span className="font-normal text-gray-400">
            ({gallery.length} {gallery.length === 1 ? "fotka" : "fotek"})
          </span>
        </span>
        {gallery.length > 0 && (
          <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map((img, index) => (
              <li
                key={`${img.path}-${index}`}
                className="group relative overflow-hidden rounded-xl border border-gray-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreviewSrc(img)}
                  alt={`Fotka č. ${index + 1} v galerii`}
                  className="h-28 w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/60 to-transparent p-1.5">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(index, -1)}
                      disabled={busy || index === 0}
                      aria-label={`Posunout fotku č. ${index + 1} doleva`}
                      className="rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-gray-700 hover:bg-white disabled:opacity-40"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(index, 1)}
                      disabled={busy || index === gallery.length - 1}
                      aria-label={`Posunout fotku č. ${index + 1} doprava`}
                      className="rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-gray-700 hover:bg-white disabled:opacity-40"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    disabled={busy}
                    aria-label={`Odebrat fotku č. ${index + 1} z galerie`}
                    className="rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-red-600 hover:bg-white disabled:opacity-40"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          disabled={busy}
          className={btnSecondaryCls}
        >
          {uploading === "gallery" ? "Nahrávám…" : "Přidat fotky do galerie"}
        </button>
        <input
          ref={galleryInputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => handleGalleryUpload(e.target.files)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className={btnPrimaryCls}>
          {saving ? "Ukládám…" : "Uložit aktualitu"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className={btnSecondaryCls}
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
