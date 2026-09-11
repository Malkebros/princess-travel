"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full min-w-[8rem] rounded-md border border-[var(--stone-line)] bg-[var(--stone-ink)]/50 px-2.5 py-2 text-[var(--stone-foam)] outline-none ring-[var(--lichen)] placeholder:text-[var(--stone-mist)]/45 focus:ring-2";

export function ChartField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={fieldClass}
    />
  );
}

export function ChartSelect({
  value,
  onChange,
  options,
  placeholder,
  allowCustom = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  allowCustom?: boolean;
}) {
  const [customMode, setCustomMode] = useState(
    Boolean(value && !options.includes(value)),
  );

  if (allowCustom && customMode) {
    return (
      <div className="space-y-1">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={fieldClass}
        />
        <button
          type="button"
          className="text-[11px] text-[var(--lichen)] hover:underline"
          onClick={() => {
            setCustomMode(false);
            onChange("");
          }}
        >
          Use list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <select
        value={options.includes(value) ? value : ""}
        onChange={(e) => {
          if (e.target.value === "__custom__") {
            setCustomMode(true);
            onChange(value && !options.includes(value) ? value : "");
            return;
          }
          onChange(e.target.value);
        }}
        className={cn(fieldClass, "appearance-none pr-6")}
      >
        <option value="">{placeholder ?? "Select"}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        {allowCustom ? <option value="__custom__">Other / type…</option> : null}
      </select>
    </div>
  );
}
