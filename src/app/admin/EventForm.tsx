"use client";

import { useState } from "react";
import type { EventItem } from "@data/types";
import DateFields from "./DateFields";
import {
  btnPrimaryCls,
  btnSecondaryCls,
  inputCls,
  labelCls,
  parseDate,
} from "./shared";

interface Props {
  initial: EventItem | null;
  saving: boolean;
  onSave: (item: EventItem) => void;
  onCancel: () => void;
}

export default function EventForm({ initial, saving, onSave, onCancel }: Props) {
  const [day, setDay] = useState(initial ? String(initial.date.day) : "");
  const [month, setMonth] = useState(initial ? String(initial.date.month) : "");
  const [year, setYear] = useState(
    initial ? String(initial.date.year) : String(new Date().getFullYear()),
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleDate(field: "day" | "month" | "year", value: string) {
    if (field === "day") setDay(value);
    else if (field === "month") setMonth(value);
    else setYear(value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const date = parseDate(day, month, year);
    if (!date) {
      setError("Zadané datum neexistuje — zkontroluj den, měsíc a rok.");
      return;
    }
    if (!title.trim()) {
      setError("Vyplň název akce.");
      return;
    }
    setError(null);
    onSave({ date, title: title.trim(), text: text.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-xl font-bold text-gray-900">
        {initial ? "Upravit akci" : "Nová akce"}
      </h3>

      <DateFields day={day} month={month} year={year} onChange={handleDate} />

      <div>
        <label htmlFor="event-title" className={labelCls}>
          Název akce
        </label>
        <input
          id="event-title"
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
          placeholder="Např. Stavění máje"
        />
      </div>

      <div>
        <label htmlFor="event-text" className={labelCls}>
          Popis akce
        </label>
        <textarea
          id="event-text"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={inputCls}
          placeholder="Krátká pozvánka — kdy, kde a co se chystá. Zobrazí se na kartě akce."
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className={btnPrimaryCls}>
          {saving ? "Ukládám…" : "Uložit akci"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className={btnSecondaryCls}
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
