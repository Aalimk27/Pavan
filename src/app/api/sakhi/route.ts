import { NextResponse } from "next/server";
import { SAKHI_PERSONA } from "@/lib/sakhi/persona";

/**
 * Sakhi's model layer. Interprets open questions; never calculates.
 * Without OPENAI_API_KEY it returns { reply: null } and the client uses Sakhi's built-in guide.
 */

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const WINDOW_MS = 5 * 60 * 1000;
const LIMIT = 24;
const hits = new Map<string, { n: number; reset: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { n: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.n++;
  return h.n > LIMIT;
}

function clean(body: unknown): { messages: Msg[]; path: string } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as { messages?: unknown; path?: unknown };
  if (!Array.isArray(b.messages)) return null;
  const messages: Msg[] = b.messages
    .filter((m): m is Msg => !!m && typeof m === "object" && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return { messages, path: typeof b.path === "string" ? b.path.slice(0, 80) : "/" };
}

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ reply: null, reason: "model-not-configured" });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return NextResponse.json({ reply: null, reason: "rate-limited" }, { status: 429 });

  const input = clean(await req.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.SAKHI_MODEL || "gpt-4o-mini";

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 320,
        messages: [
          { role: "system", content: `${SAKHI_PERSONA}\n\nThe person is currently on page: ${input.path}` },
          ...input.messages,
        ],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return NextResponse.json({ reply: null, reason: `upstream-${res.status}` });
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = data.choices?.[0]?.message?.content?.trim() || null;
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: null, reason: "upstream-error" });
  }
}
