"use client";

/**
 * My Prem Marg — local-first personal store.
 * Until passwordless accounts go live, saved profiles, homes and wisdom history
 * live only in this browser. Nothing here is sent to a server.
 */

import { useSyncExternalStore } from "react";

export interface BirthProfile {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string | null; // HH:MM, null if unknown
  place: string;
  lat: number;
  lon: number;
  tz: string;
  savedAt: string;
  summary?: { lagna?: string; moon: string; nakshatra: string; mahadasha: string };
}

export interface SavedHome {
  id: string;
  label: string;
  number?: string;
  root?: number;
  vastu?: { priority: number; gentle: number; strengths: number; savedAt: string };
  savedAt: string;
}

export interface PremMargState {
  profiles: BirthProfile[];
  homes: SavedHome[];
  /** Wisdom history: ISO day → items read that day */
  wisdom: Record<string, { gita?: string; katha?: string }>;
  /** Days on which the daily lamp was lit */
  lamps: string[];
  /** Gurukul progress: topic slug → completed practice days */
  gurukul: Record<string, number[]>;
  sakhi: { voice: boolean; whispers: boolean; name?: string };
}

const KEY = "premmarg:v1";

const EMPTY: PremMargState = {
  profiles: [],
  homes: [],
  wisdom: {},
  lamps: [],
  gurukul: {},
  sakhi: { voice: false, whispers: true },
};

let state: PremMargState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw), sakhi: { ...EMPTY.sakhi, ...JSON.parse(raw).sakhi } };
  } catch {
    state = EMPTY;
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable (private mode) — keep working in memory */
  }
}

export function getState(): PremMargState {
  load();
  return state;
}

export function update(fn: (s: PremMargState) => PremMargState): void {
  load();
  state = fn(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function usePremMarg<T>(select: (s: PremMargState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(getState()),
    () => select(EMPTY),
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/* ─────────────── Convenience actions ─────────────── */

export function saveProfile(p: Omit<BirthProfile, "id" | "savedAt">): BirthProfile {
  const profile: BirthProfile = { ...p, id: uid(), savedAt: new Date().toISOString() };
  update((s) => ({ ...s, profiles: [profile, ...s.profiles.filter((x) => !(x.date === p.date && x.time === p.time && x.place === p.place))] }));
  return profile;
}

export function removeProfile(id: string) {
  update((s) => ({ ...s, profiles: s.profiles.filter((p) => p.id !== id) }));
}

export function saveHome(h: Omit<SavedHome, "id" | "savedAt">): SavedHome {
  const home: SavedHome = { ...h, id: uid(), savedAt: new Date().toISOString() };
  update((s) => ({ ...s, homes: [home, ...s.homes] }));
  return home;
}

export function removeHome(id: string) {
  update((s) => ({ ...s, homes: s.homes.filter((h) => h.id !== id) }));
}

export function markWisdomRead(day: string, item: { gita?: string; katha?: string }) {
  update((s) => ({ ...s, wisdom: { ...s.wisdom, [day]: { ...s.wisdom[day], ...item } } }));
}

export function lightLamp(day: string) {
  update((s) => (s.lamps.includes(day) ? s : { ...s, lamps: [...s.lamps, day].sort() }));
}

export function toggleGurukulDay(topic: string, day: number) {
  update((s) => {
    const done = new Set(s.gurukul[topic] ?? []);
    if (done.has(day)) done.delete(day);
    else done.add(day);
    return { ...s, gurukul: { ...s.gurukul, [topic]: [...done].sort((a, b) => a - b) } };
  });
}

export function setSakhiPrefs(p: Partial<PremMargState["sakhi"]>) {
  update((s) => ({ ...s, sakhi: { ...s.sakhi, ...p } }));
}

export function clearAll() {
  update(() => EMPTY);
}
