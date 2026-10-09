"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { searchCities, type City } from "@/lib/astro/cities";
import styles from "./studio.module.css";

export interface Place {
  label: string;
  lat: number;
  lon: number;
  tz: string;
  source: "atlas" | "manual" | "saved";
}

export const placeFromCity = (c: City): Place => ({ label: `${c.name}, ${c.region}`, lat: c.lat, lon: c.lon, tz: c.tz, source: "atlas" });

const fmtCoord = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(2)}°${v >= 0 ? pos : neg}`;

export default function CityCombobox({
  id,
  value,
  onChange,
  invalid,
  describedBy,
  disabled,
}: {
  id: string;
  value: Place | null;
  onChange: (p: Place | null) => void;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
}) {
  const listId = useId();
  const [query, setQuery] = useState(value?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the text in step when the place is set from outside (a saved profile).
  useEffect(() => {
    if (value) setQuery(value.label);
  }, [value]);

  const results = useMemo(() => (value && query === value.label ? [] : searchCities(query, 8)), [query, value]);
  const expanded = open && results.length > 0;

  useEffect(() => {
    if (!expanded || active < 0) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, expanded]);

  const choose = (c: City) => {
    const p = placeFromCity(c);
    onChange(p);
    setQuery(p.label);
    setOpen(false);
    setActive(-1);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (results.length ? (a + 1) % results.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (results.length ? (a <= 0 ? results.length - 1 : a - 1) : -1));
    } else if (e.key === "Enter") {
      if (expanded && active >= 0 && results[active]) {
        e.preventDefault();
        choose(results[active]);
      } else if (expanded && results.length === 1) {
        e.preventDefault();
        choose(results[0]);
      }
    } else if (e.key === "Escape") {
      if (expanded) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      }
    }
  };

  const status = !query.trim() || value ? "" : results.length ? `${results.length} place${results.length === 1 ? "" : "s"} found. Use the arrow keys to choose.` : "No match in our atlas yet.";

  return (
    <div className={styles.combo}>
      <div className={`${styles.comboField} ${value ? styles.comboChosen : ""}`}>
        <svg className={styles.comboIcon} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <input
          ref={inputRef}
          id={id}
          className="input"
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          placeholder="Start typing a city — e.g. Vrindavan, London"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
            if (value) onChange(null);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKey}
        />
        {value && (
          <span className={styles.comboCheck} aria-hidden>
            ✓
          </span>
        )}
      </div>
      <ul ref={listRef} id={listId} role="listbox" aria-label="Birthplace suggestions" className={styles.comboList} hidden={!expanded}>
        {results.map((c, i) => (
          <li
            key={`${c.name}-${c.region}`}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            className={`${styles.comboOption} ${i === active ? styles.comboActive : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActive(i)}
            onClick={() => choose(c)}
          >
            <span className={styles.comboName}>{c.name}</span>
            <span className={styles.comboRegion}>{c.region}</span>
            <span className={styles.comboCoord}>
              {fmtCoord(c.lat, "N", "S")} · {fmtCoord(c.lon, "E", "W")}
            </span>
          </li>
        ))}
      </ul>
      <span className="visually-hidden" role="status">
        {status}
      </span>
    </div>
  );
}
