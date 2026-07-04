"use client";

import { inputCls, labelCls } from "./shared";

interface Props {
  day: string;
  month: string;
  year: string;
  onChange: (field: "day" | "month" | "year", value: string) => void;
}

export default function DateFields({ day, month, year, onChange }: Props) {
  return (
    <div>
      <span className={labelCls}>Datum</span>
      <div className="grid grid-cols-3 gap-3">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={31}
          required
          value={day}
          onChange={(e) => onChange("day", e.target.value)}
          className={inputCls}
          aria-label="Den"
          placeholder="Den"
        />
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={12}
          required
          value={month}
          onChange={(e) => onChange("month", e.target.value)}
          className={inputCls}
          aria-label="Měsíc"
          placeholder="Měsíc"
        />
        <input
          type="number"
          inputMode="numeric"
          min={2000}
          max={2100}
          required
          value={year}
          onChange={(e) => onChange("year", e.target.value)}
          className={inputCls}
          aria-label="Rok"
          placeholder="Rok"
        />
      </div>
    </div>
  );
}
