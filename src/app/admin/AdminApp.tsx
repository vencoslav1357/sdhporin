"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventItem, NewsItem } from "@data/types";
import EventForm from "./EventForm";
import NewsForm, { type NewsSaveResult } from "./NewsForm";
import {
  MONTHS_SHORT,
  btnPrimaryCls,
  btnSecondaryCls,
  dateMs,
  formatDate,
  inputCls,
} from "./shared";

type Tab = "news" | "events";

interface AdminData {
  news: NewsItem[];
  events: EventItem[];
  shas: { news: string; events: string };
}

interface Banner {
  kind: "success" | "error";
  text: string;
}

interface NewFile {
  path: string;
  blobSha: string;
}

function sortNews(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => dateMs(b.date) - dateMs(a.date));
}

function sortEvents(items: EventItem[]): EventItem[] {
  return [...items].sort((a, b) => dateMs(a.date) - dateMs(b.date));
}

export default function AdminApp() {
  const [phase, setPhase] = useState<"checking" | "login" | "panel">(
    "checking",
  );

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((body) => setPhase(body.authenticated ? "panel" : "login"))
      .catch(() => setPhase("login"));
  }, []);

  if (phase === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-400">Načítám…</p>
      </main>
    );
  }

  if (phase === "login") {
    return <LoginScreen onSuccess={() => setPhase("panel")} />;
  }

  return <Panel onLoggedOut={() => setPhase("login")} />;
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Přihlášení se nepovedlo.");
        return;
      }
      onSuccess();
    } catch {
      setError("Server neodpovídá. Zkus to za chvíli znovu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-100 bg-white p-8 shadow-md shadow-black/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Logo SDH Pořín"
            className="mx-auto mb-4 h-16 w-16 object-contain"
          />
          <h1 className="mb-1 text-center text-xl font-bold text-gray-900">
            Správa webu SDH Pořín
          </h1>
          <p className="mb-6 text-center text-sm text-gray-400">
            Aktuality a připravované akce
          </p>

          <label
            htmlFor="admin-password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Heslo
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className={`${btnPrimaryCls} mt-5 w-full`}
          >
            {busy ? "Přihlašuji…" : "Přihlásit se"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Panel({ onLoggedOut }: { onLoggedOut: () => void }) {
  const [data, setData] = useState<AdminData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("news");
  const [editing, setEditing] = useState<{ index: number | null } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);

  const loadData = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) {
        onLoggedOut();
        return;
      }
      const body = await res.json();
      if (!res.ok) {
        setLoadError(body.error ?? "Načtení dat se nepovedlo.");
        return;
      }
      setData({
        news: sortNews(body.news),
        events: sortEvents(body.events),
        shas: body.shas,
      });
    } catch {
      setLoadError("Server neodpovídá. Zkus obnovit stránku.");
    }
  }, [onLoggedOut]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Úspěšná hláška po chvíli sama zmizí, chybová zůstává.
  useEffect(() => {
    if (banner?.kind !== "success") return;
    const t = setTimeout(() => setBanner(null), 8000);
    return () => clearTimeout(t);
  }, [banner]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    onLoggedOut();
  }

  /** Uloží změněný seznam na GitHub. Vrátí true při úspěchu. */
  async function persist(
    kind: Tab,
    items: NewsItem[] | EventItem[],
    newFiles: NewFile[],
    message: string,
  ): Promise<boolean> {
    if (!data) return false;
    setSaving(true);
    setBanner(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [kind]: items,
          newFiles,
          baseShas: { [kind]: data.shas[kind] },
          message,
        }),
      });
      if (res.status === 401) {
        onLoggedOut();
        return false;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBanner({
          kind: "error",
          text: body.error ?? "Uložení se nepovedlo. Zkus to znovu.",
        });
        if (res.status === 409) await loadData();
        return false;
      }
      await loadData();
      setBanner({
        kind: "success",
        text: "Uloženo. Změny se na webu projeví během pár minut.",
      });
      return true;
    } catch {
      setBanner({
        kind: "error",
        text: "Server neodpovídá. Změny nebyly uloženy — zkus to znovu.",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveNews(result: NewsSaveResult) {
    if (!data) return;
    const isNew = editing?.index == null;
    const items = isNew
      ? [...data.news, result.item]
      : data.news.map((item, i) => (i === editing!.index ? result.item : item));
    const ok = await persist(
      "news",
      sortNews(items),
      result.newFiles,
      `Admin: ${isNew ? "přidána" : "upravena"} aktualita „${result.item.title}"`,
    );
    if (ok) setEditing(null);
  }

  async function saveEvent(item: EventItem) {
    if (!data) return;
    const isNew = editing?.index == null;
    const items = isNew
      ? [...data.events, item]
      : data.events.map((e, i) => (i === editing!.index ? item : e));
    const ok = await persist(
      "events",
      sortEvents(items),
      [],
      `Admin: ${isNew ? "přidána" : "upravena"} akce „${item.title}"`,
    );
    if (ok) setEditing(null);
  }

  async function deleteItem(index: number) {
    if (!data) return;
    if (tab === "news") {
      const removed = data.news[index];
      const ok = await persist(
        "news",
        data.news.filter((_, i) => i !== index),
        [],
        `Admin: smazána aktualita „${removed.title}"`,
      );
      if (ok) setConfirmDelete(null);
    } else {
      const removed = data.events[index];
      const ok = await persist(
        "events",
        data.events.filter((_, i) => i !== index),
        [],
        `Admin: smazána akce „${removed.title}"`,
      );
      if (ok) setConfirmDelete(null);
    }
  }

  function switchTab(next: Tab) {
    setTab(next);
    setEditing(null);
    setConfirmDelete(null);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hlavička */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt=""
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="font-bold text-gray-900">Správa webu SDH Pořín</h1>
              <p className="text-xs text-gray-400">
                Aktuality a připravované akce
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="rounded-xl px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            >
              Zobrazit web
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-red-600"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Hláška o výsledku */}
        {banner && (
          <div
            role={banner.kind === "error" ? "alert" : "status"}
            className={`mb-6 flex items-start justify-between gap-3 rounded-2xl border p-4 text-sm font-medium ${
              banner.kind === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <span>{banner.text}</span>
            <button
              type="button"
              onClick={() => setBanner(null)}
              aria-label="Zavřít hlášku"
              className="font-bold opacity-60 transition hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Záložky */}
        <div className="mb-6 flex gap-2">
          {(
            [
              ["news", "Aktuality"],
              ["events", "Připravované akce"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => switchTab(key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === key
                  ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-4 text-sm font-medium text-red-800">{loadError}</p>
            <button
              type="button"
              onClick={loadData}
              className={btnSecondaryCls}
            >
              Zkusit znovu
            </button>
          </div>
        )}

        {!data && !loadError && (
          <p className="py-16 text-center text-gray-400">Načítám data…</p>
        )}

        {data && !loadError && (
          <>
            {editing ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md shadow-black/5 md:p-8">
                {tab === "news" ? (
                  <NewsForm
                    initial={
                      editing.index == null ? null : data.news[editing.index]
                    }
                    saving={saving}
                    onSave={saveNews}
                    onCancel={() => setEditing(null)}
                  />
                ) : (
                  <EventForm
                    initial={
                      editing.index == null ? null : data.events[editing.index]
                    }
                    saving={saving}
                    onSave={saveEvent}
                    onCancel={() => setEditing(null)}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing({ index: null });
                      setConfirmDelete(null);
                    }}
                    className={btnPrimaryCls}
                  >
                    + {tab === "news" ? "Přidat aktualitu" : "Přidat akci"}
                  </button>
                </div>

                {tab === "news" ? (
                  <NewsList
                    items={data.news}
                    saving={saving}
                    confirmDelete={confirmDelete}
                    onEdit={(index) => setEditing({ index })}
                    onAskDelete={setConfirmDelete}
                    onDelete={deleteItem}
                  />
                ) : (
                  <EventList
                    items={data.events}
                    saving={saving}
                    confirmDelete={confirmDelete}
                    onEdit={(index) => setEditing({ index })}
                    onAskDelete={setConfirmDelete}
                    onDelete={deleteItem}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

interface ListProps<T> {
  items: T[];
  saving: boolean;
  confirmDelete: number | null;
  onEdit: (index: number) => void;
  onAskDelete: (index: number | null) => void;
  onDelete: (index: number) => void;
}

function RowActions({
  index,
  title,
  saving,
  confirmDelete,
  onEdit,
  onAskDelete,
  onDelete,
}: {
  index: number;
  title: string;
  saving: boolean;
  confirmDelete: number | null;
  onEdit: (index: number) => void;
  onAskDelete: (index: number | null) => void;
  onDelete: (index: number) => void;
}) {
  if (confirmDelete === index) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-red-600">
          Opravdu smazat?
        </span>
        <button
          type="button"
          onClick={() => onDelete(index)}
          disabled={saving}
          className="rounded-xl bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? "Mažu…" : "Smazat"}
        </button>
        <button
          type="button"
          onClick={() => onAskDelete(null)}
          disabled={saving}
          className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Ne
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onEdit(index)}
        disabled={saving}
        aria-label={`Upravit „${title}"`}
        className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
      >
        Upravit
      </button>
      <button
        type="button"
        onClick={() => onAskDelete(index)}
        disabled={saving}
        aria-label={`Smazat „${title}"`}
        className="rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        Smazat
      </button>
    </div>
  );
}

function NewsList(props: ListProps<NewsItem>) {
  if (props.items.length === 0) {
    return (
      <p className="py-16 text-center text-gray-400">
        Zatím žádné aktuality. Přidej první tlačítkem nahoře.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {props.items.map((item, index) => (
        <li
          key={`${item.title}-${index}`}
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${item.mainImage}`}
            alt=""
            className="h-14 w-20 flex-shrink-0 rounded-xl border border-gray-100 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-400">
              {formatDate(item.date)} · galerie: {item.gallery.length}
              {!item.preview && (
                <span className="text-amber-600"> · bez krátkého popisu</span>
              )}
            </p>
          </div>
          <RowActions
            index={index}
            title={item.title}
            saving={props.saving}
            confirmDelete={props.confirmDelete}
            onEdit={props.onEdit}
            onAskDelete={props.onAskDelete}
            onDelete={props.onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

function EventList(props: ListProps<EventItem>) {
  if (props.items.length === 0) {
    return (
      <p className="py-16 text-center text-gray-400">
        Zatím žádné akce. Přidej první tlačítkem nahoře.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {props.items.map((item, index) => (
        <li
          key={`${item.title}-${index}`}
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          {/* Stejný odznak s datem jako na webu — obsah vypadá jako na kartě akce */}
          <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20">
            <span className="text-xl font-black leading-none">
              {item.date.day}
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase opacity-90">
              {MONTHS_SHORT[item.date.month - 1]}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-400">
              {formatDate(item.date)}
              {!item.text && (
                <span className="text-amber-600"> · bez popisu</span>
              )}
            </p>
          </div>
          <RowActions
            index={index}
            title={item.title}
            saving={props.saving}
            confirmDelete={props.confirmDelete}
            onEdit={props.onEdit}
            onAskDelete={props.onAskDelete}
            onDelete={props.onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
