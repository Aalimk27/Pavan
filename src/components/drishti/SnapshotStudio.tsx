"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { formatOffset, isValidTimeZone, localToUtc, zoneOffsetMinutes } from "@/lib/astro/time";
import { isValidDate } from "@/lib/ank";
import { track } from "@/lib/analytics";
import { getState } from "@/lib/store";
import { sakhi } from "@/components/sakhi/bus";
import CityCombobox, { type Place } from "./CityCombobox";
import SnapshotResult from "./SnapshotResult";
import { MONTHS, runSnapshot, type SnapshotParams, type SnapshotRun } from "./snapshot";
import styles from "./studio.module.css";

type Field = "date" | "time" | "place" | "lat" | "lon" | "tz";
type Errors = Partial<Record<Field, string>>;

const FIELD_ID: Record<Field, string> = {
  date: "dob-day",
  time: "dob-time",
  place: "dob-place",
  lat: "dob-lat",
  lon: "dob-lon",
  tz: "dob-tz",
};

function timeZones(): string[] {
  try {
    const intl = Intl as unknown as { supportedValuesOf?: (k: string) => string[] };
    const list = intl.supportedValuesOf?.("timeZone") ?? [];
    return list.length ? list : ["UTC"];
  } catch {
    return ["UTC"];
  }
}

export default function SnapshotStudio({ intro }: { intro: ReactNode }) {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [time, setTime] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [manual, setManual] = useState({ label: "", lat: "", lon: "", tz: "" });
  const [zones, setZones] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [run, setRun] = useState<SnapshotRun | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  /* ── first interaction ── */
  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track("calculator_started", { tool: "drishti_snapshot" });
  };

  /* ── ?profile=<id> — prefill from My Prem Marg and reveal ── */
  useEffect(() => {
    const pid = new URLSearchParams(window.location.search).get("profile");
    if (!pid) return;
    const p = getState().profiles.find((x) => x.id === pid);
    if (!p) {
      setNotice("That saved profile isn't on this device — enter the details below and you can save it again.");
      return;
    }
    const [yy, mm, dd] = p.date.split("-").map(Number);
    const [th, tm] = p.time ? p.time.split(":").map(Number) : [NaN, NaN];
    const saved: Place = { label: p.place, lat: p.lat, lon: p.lon, tz: p.tz, source: "saved" };
    setName(p.name === "My chart" ? "" : p.name);
    setDay(String(dd));
    setMonth(String(mm));
    setYear(String(yy));
    setTime(p.time ?? "");
    setTimeUnknown(!p.time);
    setPlace(saved);
    setNotice(`Loaded “${p.name}” from My Prem Marg.`);
    started.current = true;
    if (isValidDate(yy, mm, dd) && isValidTimeZone(p.tz)) {
      setRun(runSnapshot({ name: p.name === "My chart" ? "" : p.name, year: yy, month: mm, day: dd, time: p.time ? { hour: th, minute: tm } : null, place: saved }));
    }
  }, []);

  useEffect(() => {
    if (!manualOpen || zones.length) return;
    const list = timeZones();
    setZones(list);
    setManual((m) => (m.tz ? m : { ...m, tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" }));
  }, [manualOpen, zones.length]);

  /* ── derived ── */
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const dateOk = /^\d{4}$/.test(year.trim()) && isValidDate(y, m, d) && y >= 1900;
  const timeMatch = /^(\d{1,2}):(\d{2})/.exec(time);
  const timeOk = !!timeMatch && Number(timeMatch[1]) < 24 && Number(timeMatch[2]) < 60;

  const manualPlace = useMemo<Place | null>(() => {
    const lat = Number.parseFloat(manual.lat);
    const lon = Number.parseFloat(manual.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    if (!manual.tz || !isValidTimeZone(manual.tz)) return null;
    const label = manual.label.trim() || `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;
    return { label, lat, lon, tz: manual.tz, source: "manual" };
  }, [manual]);

  const resolvedPlace = manualOpen ? manualPlace : place;

  const offset = useMemo(() => {
    if (!dateOk || !resolvedPlace) return null;
    const hour = !timeUnknown && timeOk ? Number(timeMatch![1]) : 12;
    const minute = !timeUnknown && timeOk ? Number(timeMatch![2]) : 0;
    try {
      const { offsetMinutes } = localToUtc({ year: y, month: m, day: d, hour, minute }, resolvedPlace.tz);
      const today = zoneOffsetMinutes(resolvedPlace.tz, Date.now());
      return { label: resolvedPlace.source === "manual" ? resolvedPlace.label : resolvedPlace.label.split(",")[0], offset: offsetMinutes, differs: today !== offsetMinutes, today, tz: resolvedPlace.tz };
    } catch {
      return null;
    }
  }, [dateOk, resolvedPlace, timeUnknown, timeOk, timeMatch, y, m, d]);

  /* ── validation ── */
  function validate(): Errors {
    const e: Errors = {};
    if (!day.trim() || !month || !year.trim()) e.date = "Please add your full date of birth — day, month and year.";
    else if (!/^\d{4}$/.test(year.trim())) e.date = "Please write the year in four digits, e.g. 1990.";
    else if (!isValidDate(y, m, d)) e.date = "That date isn't on the calendar — please check the day and month.";
    else if (y < 1900) e.date = "Snapshots currently cover births from 1900 onwards.";
    else if (Date.UTC(y, m - 1, d) > Date.now()) e.date = "That date is still to come — please check the year.";
    if (!timeUnknown && !timeOk) e.time = "Please add your birth time, or tick “I don’t know my birth time”.";
    if (manualOpen) {
      const lat = Number.parseFloat(manual.lat);
      const lon = Number.parseFloat(manual.lon);
      if (!Number.isFinite(lat) || Math.abs(lat) > 90) e.lat = "Latitude runs from −90 (south) to 90 (north).";
      if (!Number.isFinite(lon) || Math.abs(lon) > 180) e.lon = "Longitude runs from −180 (west) to 180 (east).";
      if (!manual.tz || !isValidTimeZone(manual.tz)) e.tz = "Choose the time zone of your birthplace.";
    } else if (!place) e.place = "Choose your birthplace from the list — or enter its coordinates.";
    return e;
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    markStarted();
    const e = validate();
    setErrors(e);
    const first = (Object.keys(FIELD_ID) as Field[]).find((k) => e[k]);
    if (first) {
      document.getElementById(FIELD_ID[first])?.focus();
      sakhi.mood("attentive", 1800);
      return;
    }
    const p = resolvedPlace!;
    const params: SnapshotParams = {
      name: name.trim(),
      year: y,
      month: m,
      day: d,
      time: timeUnknown ? null : { hour: Number(timeMatch![1]), minute: Number(timeMatch![2]) },
      place: p,
    };
    track("birth_details_completed", { tool: "drishti_snapshot", time_known: !timeUnknown, place_source: p.source });
    setBusy(true);
    sakhi.mood("thinking", 1400);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        setRun(runSnapshot(params));
        setBusy(false);
      },
      reduce ? 0 : 750,
    );
  }

  const reset = () => {
    setRun(null);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("dob-name")?.focus({ preventScroll: true });
    });
  };

  const err = (f: Field) =>
    errors[f] ? (
      <p className="error-text" id={`${FIELD_ID[f]}-err`} role="alert">
        {errors[f]}
      </p>
    ) : null;

  const clearErr = (...f: Field[]) => setErrors((e) => (f.some((k) => e[k]) ? Object.fromEntries(Object.entries(e).filter(([k]) => !f.includes(k as Field))) : e));

  return (
    <>
      <div className={styles.studio}>
        <div className={styles.intro}>{intro}</div>

        <form ref={formRef} className={`card card--gilded ${styles.form}`} onSubmit={onSubmit} onFocusCapture={markStarted} noValidate aria-labelledby="snapshot-form-title">
          <div className={styles.formHead}>
            <p className={styles.formKicker} id="snapshot-form-title">
              Your birth details
            </p>
            <span className="badge badge--free">Free</span>
          </div>

          {notice && (
            <p className="note" role="status">
              {notice}
            </p>
          )}

          <div className="field">
            <label htmlFor="dob-name">
              Name <span className={styles.optional}>(optional)</span>
            </label>
            <input id="dob-name" className="input" type="text" autoComplete="given-name" placeholder="Only used to title your snapshot" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <fieldset className={styles.fieldset} aria-describedby={errors.date ? "dob-day-err" : undefined}>
            <legend className="label">Date of birth</legend>
            <div className={styles.dateRow}>
              <div className={styles.sub}>
                <label htmlFor="dob-day" className={styles.subLabel}>
                  Day
                </label>
                <input
                  id="dob-day"
                  className="input"
                  inputMode="numeric"
                  autoComplete="bday-day"
                  placeholder="DD"
                  maxLength={2}
                  value={day}
                  aria-invalid={!!errors.date || undefined}
                  onChange={(e) => {
                    setDay(e.target.value.replace(/\D/g, "").slice(0, 2));
                    clearErr("date");
                  }}
                />
              </div>
              <div className={styles.sub}>
                <label htmlFor="dob-month" className={styles.subLabel}>
                  Month
                </label>
                <select
                  id="dob-month"
                  className="select"
                  autoComplete="bday-month"
                  value={month}
                  aria-invalid={!!errors.date || undefined}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    clearErr("date");
                  }}
                >
                  <option value="">Month</option>
                  {MONTHS.map((mo, i) => (
                    <option key={mo} value={i + 1}>
                      {mo}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.sub}>
                <label htmlFor="dob-year" className={styles.subLabel}>
                  Year
                </label>
                <input
                  id="dob-year"
                  className="input"
                  inputMode="numeric"
                  autoComplete="bday-year"
                  placeholder="YYYY"
                  maxLength={4}
                  value={year}
                  aria-invalid={!!errors.date || undefined}
                  onChange={(e) => {
                    setYear(e.target.value.replace(/\D/g, "").slice(0, 4));
                    clearErr("date");
                  }}
                />
              </div>
            </div>
            {err("date")}
          </fieldset>

          <div className={styles.timeBlock}>
            <div className="field">
              <label htmlFor="dob-time">Time of birth</label>
              <input
                id="dob-time"
                className="input"
                type="time"
                value={time}
                disabled={timeUnknown}
                aria-invalid={!!errors.time || undefined}
                aria-describedby={`dob-time-hint${errors.time ? " dob-time-err" : ""}`}
                onChange={(e) => {
                  setTime(e.target.value);
                  clearErr("time");
                }}
              />
              <p className="hint" id="dob-time-hint">
                Local time where you were born, as on your birth record.
              </p>
            </div>
            <label className={`${styles.toggle} ${timeUnknown ? styles.toggleOn : ""}`} id="time-unknown">
              <input
                type="checkbox"
                checked={timeUnknown}
                onChange={(e) => {
                  setTimeUnknown(e.target.checked);
                  clearErr("time");
                  if (e.target.checked)
                    sakhi.whisper("That’s alright. I’ll calculate everything that doesn’t need the exact time — and tell you plainly what I’ve left out.", { selector: "#time-unknown" });
                }}
              />
              <span className={styles.switch} aria-hidden />
              <span>I don&rsquo;t know my birth time</span>
            </label>
          </div>
          {err("time")}
          {timeUnknown && (
            <p className={`note ${styles.softNote}`}>
              Without a time, your Lagna is withheld and the Moon is read at local noon. If the Moon changed sign or nakshatra that day, your snapshot will say so — and dasha dates become approximate.
            </p>
          )}

          <div className="field">
            <label htmlFor="dob-place">Birthplace</label>
            {!manualOpen ? (
              <>
                <CityCombobox
                  id="dob-place"
                  value={place}
                  invalid={!!errors.place}
                  describedBy={errors.place ? "dob-place-err" : undefined}
                  onChange={(p) => {
                    setPlace(p);
                    clearErr("place");
                    if (p) sakhi.mood("attentive", 1200);
                  }}
                />
                {err("place")}
              </>
            ) : (
              <div className={styles.manual}>
                <div className={styles.sub}>
                  <label htmlFor="dob-place" className={styles.subLabel}>
                    Place name <span className={styles.optional}>(optional)</span>
                  </label>
                  <input id="dob-place" className="input" placeholder="e.g. Govardhan" value={manual.label} onChange={(e) => setManual({ ...manual, label: e.target.value })} />
                </div>
                <div className={styles.coordRow}>
                  <div className={styles.sub}>
                    <label htmlFor="dob-lat" className={styles.subLabel}>
                      Latitude
                    </label>
                    <input
                      id="dob-lat"
                      className="input"
                      inputMode="decimal"
                      placeholder="27.50"
                      value={manual.lat}
                      aria-invalid={!!errors.lat || undefined}
                      aria-describedby={`dob-lat-hint${errors.lat ? " dob-lat-err" : ""}`}
                      onChange={(e) => {
                        setManual({ ...manual, lat: e.target.value });
                        clearErr("lat");
                      }}
                    />
                    <span className="hint" id="dob-lat-hint">
                      North +, South −
                    </span>
                    {err("lat")}
                  </div>
                  <div className={styles.sub}>
                    <label htmlFor="dob-lon" className={styles.subLabel}>
                      Longitude
                    </label>
                    <input
                      id="dob-lon"
                      className="input"
                      inputMode="decimal"
                      placeholder="77.46"
                      value={manual.lon}
                      aria-invalid={!!errors.lon || undefined}
                      aria-describedby={`dob-lon-hint${errors.lon ? " dob-lon-err" : ""}`}
                      onChange={(e) => {
                        setManual({ ...manual, lon: e.target.value });
                        clearErr("lon");
                      }}
                    />
                    <span className="hint" id="dob-lon-hint">
                      East +, West −
                    </span>
                    {err("lon")}
                  </div>
                </div>
                <div className={styles.sub}>
                  <label htmlFor="dob-tz" className={styles.subLabel}>
                    Time zone
                  </label>
                  <select
                    id="dob-tz"
                    className="select"
                    value={manual.tz}
                    aria-invalid={!!errors.tz || undefined}
                    onChange={(e) => {
                      setManual({ ...manual, tz: e.target.value });
                      clearErr("tz");
                    }}
                  >
                    {!manual.tz && <option value="">Choose a time zone</option>}
                    {zones.map((z) => (
                      <option key={z} value={z}>
                        {z.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  {err("tz")}
                </div>
              </div>
            )}
            <button
              type="button"
              className={styles.textBtn}
              aria-expanded={manualOpen}
              onClick={() => {
                setManualOpen((o) => !o);
                setErrors((e) => ({ ...e, place: undefined, lat: undefined, lon: undefined, tz: undefined }));
              }}
            >
              {manualOpen ? "← Search our atlas instead" : "Not listed? Enter coordinates"}
            </button>
          </div>

          <div className={styles.resolved} aria-live="polite">
            {offset ? (
              <span
                className={styles.resolvedChip}
                data-sakhi="Birth time is converted to Universal Time using the historical rules for that zone and date — daylight saving and wartime offsets included."
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <span>
                  <strong>{offset.label}</strong> · {formatOffset(offset.offset)} on that date
                  {offset.differs && <span className={styles.historic}> · historical offset (today {formatOffset(offset.today)})</span>}
                </span>
              </span>
            ) : (
              <span className={styles.resolvedHint}>Your time zone offset will appear here once the date and place are set.</span>
            )}
          </div>

          <button type="submit" className={`btn btn--lg ${styles.submit}`} disabled={busy} aria-busy={busy}>
            {busy ? (
              <>
                <span className={styles.spinner} aria-hidden /> Reading the sky…
              </>
            ) : (
              <>Reveal my snapshot</>
            )}
          </button>
          <p className={styles.privacy}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <rect x="5" y="10" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Calculated on this device. Nothing is sent anywhere unless you choose to save it.
          </p>
        </form>
      </div>

      {run && <SnapshotResult key={run.id} run={run} onReset={reset} />}
    </>
  );
}
