import type { GuideStep } from "@/lib/sakhi/types";

/** What Sakhi whispers when you arrive somewhere — once per page per visit. */
export const PAGE_WHISPERS: Record<string, { text: string; cta?: { label: string; message?: string; href?: string } }> = {
  "/drishti": {
    text: "This is DRISHTI. Your free snapshot is calculated live from real astronomy — no guessing. Shall we do it together?",
    cta: { label: "Do it in chat", message: "I'd like my free DRISHTI snapshot" },
  },
  "/vastu": { text: "Welcome to the Vastu studio. No floor plan handy? Try the sample home first — it takes a minute." },
  "/ank": { text: "Numbers are a mirror, not a verdict. Your Mulank needs only your birth day — try it." },
  "/katha": { text: "Today's story takes about three minutes. A good pause in a busy day." },
  "/gita": { text: "Read the verse slowly — once aloud if you can. I can recite the Sanskrit for you." },
  "/gurukul": { text: "Pick the one topic that feels true right now. Seven small days can change a lot." },
  "/membership": { text: "Prices aren't final yet — we'll set them fairly once we've learnt what members truly use." },
  "/my": { text: "Everything here stays on this device, private to you." },
  "/advisory": { text: "When a decision is big, a real person should sit beside you. Your request goes straight to RadheyShyam Realtor." },
  "/about": { text: "This is our promise: guidance without fear. Always." },
  "/sakhi": { text: "That's me! Ask me anything — or press / to call me from any page." },
};

export function whisperFor(path: string) {
  if (PAGE_WHISPERS[path]) return PAGE_WHISPERS[path];
  if (path.startsWith("/katha/")) return { text: "Read slowly. The lesson and today's action are at the end." };
  if (path.startsWith("/gurukul/")) return { text: "Tick off each day of practice — I'll keep your progress on this device." };
  return null;
}

/** Guided tour of the homepage. Sections carry matching data-tour attributes. */
export const HOME_TOUR: GuideStep[] = [
  { selector: '[data-tour="clarity"]', text: "Start here. Choose what you'd like clarity about and I'll open the right door for you." },
  { selector: '[data-tour="pillars"]', text: "Six doors. Three help you understand yourself, your space and your numbers; three help you live it every day." },
  { selector: '[data-tour="free-tools"]', text: "Free tools come first — real calculations, before anyone asks you to pay." },
  { selector: '[data-tour="daily"]', text: "A verse and a story every day. Light a lamp when you've read them — I'll keep count." },
  { selector: '[data-tour="promise"]', text: "And our promise: guidance without fear. Always. Press / any time to call me." },
];
