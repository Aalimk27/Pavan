/**
 * Strict, dependency-free input validation for the public form endpoints.
 * Everything is trimmed, length-bounded and stripped of control characters.
 */

const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function isEmail(v: unknown): v is string {
  return typeof v === "string" && v.length >= 6 && v.length <= 254 && EMAIL_RE.test(v);
}

/** Trim, collapse control characters, bound length. Returns null when missing/too long/too short. */
export function cleanText(v: unknown, { min = 0, max, multiline = false }: { min?: number; max: number; multiline?: boolean }): string | null {
  if (v == null || v === "") return min === 0 ? "" : null;
  if (typeof v !== "string") return null;
  // eslint-disable-next-line no-control-regex
  const stripped = multiline ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : v.replace(/[\u0000-\u001F\u007F]+/g, " ");
  const t = stripped.trim();
  if (t.length < min || t.length > max) return null;
  return t;
}

export function cleanEmail(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().toLowerCase();
  return isEmail(t) ? t : null;
}

/** Parse a JSON body defensively, refusing anything over `limit` bytes. */
export async function readJson(req: Request, limit = 16_000): Promise<Record<string, unknown> | null> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > limit) return null;
  try {
    const text = await req.text();
    if (text.length > limit) return null;
    const data: unknown = JSON.parse(text);
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Escape user text before it goes into an HTML email. */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

/** Mask an email for logs: "pa***@proton.me". */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}***@${domain ?? ""}`;
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}
