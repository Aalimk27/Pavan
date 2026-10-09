import { randomInt } from "node:crypto";

/** Unambiguous alphabet — no 0/O, 1/I/L. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** A short, human-friendly reference such as "PM-7K2Q9". */
export function makeReference(prefix = "PM", length = 5): string {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return `${prefix}-${out}`;
}
