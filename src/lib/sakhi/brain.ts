/**
 * SAKHI — deterministic conversation core (blueprint §10).
 *
 * Sakhi welcomes, routes, collects missing data, explains products without pressure,
 * offers ONE relevant next step, escalates property and personal advisory to
 * RadheyShyam Realtor, and never impersonates a human spiritual authority.
 *
 * Every number, position and date she shows comes from the deterministic engines.
 * Open-ended questions she cannot answer confidently are deferred to the model layer
 * (/api/sakhi), which only ever interprets — it never calculates.
 */

import { bhagyaAnk, homeNumber, mulank, PERSONAL_MEANING, HOME_MEANING, type AnkResult } from "@/lib/ank";
import { computeSnapshot, formatDegrees, GRAHA_SANSKRIT } from "@/lib/astro/engine";
import { findCity } from "@/lib/astro/cities";
import { localToUtc } from "@/lib/astro/time";
import { gitaById } from "@/lib/content/gita";
import { GURUKUL } from "@/lib/content/gurukul";
import { KATHAS } from "@/lib/content/katha";
import { GITA } from "@/lib/content/gita";
import { pickDaily } from "@/lib/daily";
import { CLARITY, SITE } from "@/lib/site";
import type { RoomType } from "@/lib/vastu/engine";
import { parseDate, parseDayOnly, parseHomeNumber, parseTime, parseVerseRef, saysTimeUnknown } from "./parse";
import type { AnkCardItem, BrainContext, BrainReply, PendingSnapshot, SnapshotCardData } from "./types";

const has = (t: string, re: RegExp) => re.test(t);
const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function ankItem(label: string, source: string, r: AnkResult, kind: "personal" | "home"): AnkCardItem {
  const m = (kind === "home" ? HOME_MEANING : PERSONAL_MEANING)[r.root];
  return { label, source, compound: r.compound, root: r.root, chain: r.chain, title: m.title, essence: m.essence };
}

/* ───────────────────────────── Snapshot (slot filling) ───────────────────────────── */

function snapshotCard(p: Required<Pick<PendingSnapshot, "date" | "place">> & PendingSnapshot, now: Date): SnapshotCardData {
  const timeKnown = !!p.time;
  const local = { ...p.date, hour: p.time?.hour ?? 12, minute: p.time?.minute ?? 0 };
  const { utc } = localToUtc(local, p.place.tz);
  const s = computeSnapshot({ utc, latitude: p.place.lat, longitude: p.place.lon, timeKnown }, now);
  return {
    name: p.name,
    dateLabel: `${p.date.day} ${MONTH[p.date.month - 1]} ${p.date.year}${timeKnown ? `, ${String(p.time!.hour).padStart(2, "0")}:${String(p.time!.minute).padStart(2, "0")}` : " (time unknown)"}`,
    place: p.place.name,
    lagna: s.lagna ? { rashi: s.lagna.rashi.name, english: s.lagna.rashi.english, degree: formatDegrees(s.lagna.degreeInRashi) } : undefined,
    moon: { rashi: s.moon.rashi.name, english: s.moon.rashi.english, degree: formatDegrees(s.moon.degreeInRashi) },
    sun: { rashi: s.sun.rashi.name, english: s.sun.rashi.english },
    nakshatra: { name: s.moon.nakshatra.name, pada: s.moon.pada, deity: s.moon.nakshatra.deity, lord: s.moon.nakshatra.lord },
    mahadasha: { lord: s.dasha.mahadasha.lord, until: fmtDate(s.dasha.mahadasha.end) },
    antardasha: { lord: s.dasha.antardasha.lord, until: fmtDate(s.dasha.antardasha.end) },
    confidence: s.confidence,
    timeKnown,
  };
}

function continueSnapshot(text: string, pending: PendingSnapshot, ctx: BrainContext): BrainReply {
  const next: PendingSnapshot = { ...pending };
  const date = parseDate(text);
  if (date) next.date = { year: date.year, month: date.month, day: date.day };
  if (next.date) {
    const time = parseTime(text);
    if (time) next.time = time;
    else if (saysTimeUnknown(text)) next.time = null;
  }
  const city = findCity(text);
  if (city) next.place = { name: `${city.name}, ${city.region}`, lat: city.lat, lon: city.lon, tz: city.tz };

  if (!next.date) {
    return {
      text: "Let's start with your date of birth — for example, 14 March 1990.",
      pending: next,
      chips: ["Cancel"],
    };
  }
  if (next.time === undefined) {
    const note = date?.assumedDayFirst ? ` (I read that as ${date.day} ${MONTH[date.month - 1]} — tell me if you meant otherwise.)` : "";
    return {
      text: `Thank you${note}. What time were you born? An exact time lets me find your Lagna. If you're not sure, just say "I don't know".`,
      pending: next,
      chips: ["I don't know my time"],
    };
  }
  if (!next.place) {
    return {
      text: "And where were you born? Tell me the city — for example, Vrindavan, Mumbai, London or Toronto.",
      pending: next,
      chips: ["New Delhi", "Mumbai", "London", "New York"],
    };
  }
  const data = snapshotCard(next as Required<Pick<PendingSnapshot, "date" | "place">> & PendingSnapshot, ctx.now);
  const maha = data.mahadasha.lord;
  return {
    text: `Here is your snapshot. Your Moon rests in ${data.moon.rashi} (${data.moon.english}) in ${data.nakshatra.name} Nakshatra, and you are in the ${maha} (${GRAHA_SANSKRIT[maha as keyof typeof GRAHA_SANSKRIT]}) Mahadasha until ${data.mahadasha.until}.${data.timeKnown ? "" : " Without a birth time I've left out your Lagna — everything else holds."} These are calculated, not guessed.`,
    cards: [{ kind: "snapshot", data }],
    chips: ["What does my Nakshatra mean?", "What is DRISHTI Core?", "Save to My Prem Marg"],
    pending: null,
    mood: "joy",
    profile: {
      name: next.name ?? "My chart",
      date: `${next.date.year}-${String(next.date.month).padStart(2, "0")}-${String(next.date.day).padStart(2, "0")}`,
      time: next.time ? `${String(next.time.hour).padStart(2, "0")}:${String(next.time.minute).padStart(2, "0")}` : null,
      place: next.place.name,
      lat: next.place.lat,
      lon: next.place.lon,
      tz: next.place.tz,
      summary: { lagna: data.lagna?.rashi, moon: data.moon.rashi, nakshatra: data.nakshatra.name, mahadasha: data.mahadasha.lord },
    },
  };
}

/* ───────────────────────────── Vastu quick answers ───────────────────────────── */

const ROOM_WORDS: Array<[RegExp, RoomType]> = [
  [/\b(main )?(door|entrance|entry|gate)\b/, "entrance"],
  [/\bkitchen|stove|cooking\b/, "kitchen"],
  [/\bmaster (bed)?room\b/, "master"],
  [/\b(bed ?room|kids room|children'?s room|guest room)\b/, "bedroom"],
  [/\b(toilet|bathroom|washroom|wc|lavatory)\b/, "toilet"],
  [/\b(pooja|puja|mandir|temple room|prayer room|altar)\b/, "pooja"],
  [/\b(living room|hall|drawing room|lounge)\b/, "living"],
  [/\bdining\b/, "dining"],
  [/\b(study|office|work desk|home office)\b/, "study"],
  [/\b(stairs|staircase|stairway)\b/, "stairs"],
  [/\b(storage|store room|heavy furniture|almirah|safe|locker)\b/, "storage"],
  [/\b(balcony|terrace|veranda|courtyard)\b/, "balcony"],
  [/\b(borewell|bore well|sump|underground tank|well)\b/, "sump"],
  [/\b(overhead tank|water tank|roof tank)\b/, "overhead"],
];

/* ───────────────────────────── Gurukul emotional routing ───────────────────────────── */

const FEELINGS: Array<[RegExp, string, string]> = [
  [/\b(angry|anger|furious|irritat|rage|lost my temper|frustrat)/, "anger", "Anger is energy asking for direction. Let's look at it gently, without blaming yourself."],
  [/\b(afraid|fear|scared|anxious|anxiety|worried|worry|nervous|panic)/, "fear", "I hear you. Fear shrinks when it's named and met with one small step. You're not alone in this."],
  [/\b(jealous|envy|envious|comparing|comparison|everyone else|others have)/, "comparison", "Comparison steals the joy of your own path. The Gita has something lovely to say about that."],
  [/\b(ego|pride|proud|arrogan)/, "ego", "Noticing pride is itself humility at work. Let's explore it together."],
  [/\b(crav|desire|tempt|addict|can'?t stop|want more)/, "desire", "Desire is natural — the art is choosing which ones to feed."],
  [/\b(fail|failed|failure|rejected|lost my job|setback|didn'?t get)/, "success-and-failure", "A setback is an event, not an identity. Let's find steadiness first."],
  [/\b(lonely|alone|relationship|partner|marriage|husband|wife|friend(ship)?|family (fight|problem))/, "relationships", "Relationships are where love becomes practice. Let's start with what you can bring."],
  [/\b(money|debt|finance|salary|savings|broke|loan)\b/, "money", "Money is a tool of dharma when earned and used well. Let's look at it calmly."],
  [/\b(lazy|procrastinat|no discipline|can'?t focus|distract|motivation)/, "discipline", "Discipline grows from tiny, repeated promises kept to yourself."],
  [/\b(purpose|duty|what should i do|my path|calling|confused about career)/, "duty", "Your svadharma — your own path — becomes clearer when you act on what is in front of you."],
  [/\b(grateful|gratitude|thankful)/, "gratitude", "Gratitude turns what we have into enough. Beautiful that you're here with it."],
  [/\b(leader|leadership|team|manage people|boss)/, "leadership", "The Gita's idea of leadership begins with example. Let's look at it."],
  [/\b(serve|service|seva|volunteer|help others)/, "service", "Seva is love in action — and it changes the giver most."],
  [/\b(stress|stressed|overwhelm|burn ?out|tired|exhausted|can'?t sleep)/, "discipline", "That sounds heavy. Let's slow down together — rhythm and rest are a form of strength."],
  [/\b(sad|down|low|depress|hopeless|grief|griev|heartbroken)/, "fear", "I'm really glad you told me. Let's take this gently, one breath at a time."],
];

const CRISIS = /\b(suicid|kill myself|end my life|want to die|self[- ]?harm|hurt myself|no reason to live)\b/;

/* ───────────────────────────── Main entry ───────────────────────────── */

export function respond(raw: string, ctx: BrainContext): BrainReply {
  const text = raw.trim();
  const t = text.toLowerCase();

  // 0. Care first — always.
  if (has(t, CRISIS)) {
    return {
      text: "I'm so glad you reached out, and I'm taking what you said seriously. You deserve support from a real person right now. Please contact your local emergency number, or a crisis line in your country — they are there for exactly this, any hour. If you can, reach out to someone you trust and let them sit with you. I'm here too, and I'm not going anywhere.",
      cards: [{ kind: "care" }],
      pending: null,
      mood: "attentive",
    };
  }

  // 1. Cancel any pending flow.
  if (ctx.pending && has(t, /^(cancel|stop|never ?mind|leave it|not now)\b/)) {
    return { text: "Of course. Whenever you're ready, I'm here.", pending: null, chips: starterChips() };
  }

  // 2. Continue a pending snapshot.
  if (ctx.pending?.intent === "snapshot") return continueSnapshot(text, ctx.pending, ctx);

  // 2b. Save the last snapshot.
  if (has(t, /\bsave (it|this|to my prem marg|my (chart|profile|snapshot))\b|^save\b/)) {
    return { text: "Saved to My Prem Marg — on this device, private to you. 🪔", saveProfile: true, cards: [{ kind: "links", links: [{ label: "Open My Prem Marg", href: "/my" }] }] };
  }
  if (has(t, /\bwhat does my nakshatra mean\b/)) {
    return { text: "Your Nakshatra is the star the Moon was passing at your birth — it colours how your mind feels and responds. Open DRISHTI to read your Nakshatra's essence beside your snapshot; the full reading goes much deeper.", cards: [routeCard("drishti")] };
  }
  if (has(t, /\bwhat is drishti (core|deep|signature)\b|\bdrishti (tiers|reports?)\b/)) return productsReply();

  // 3. Social.
  if (has(t, /^(hi|hello|hey|namaste|namaskar|radhe radhe|jai shri krishna|jai shree krishna|hare krishna|pranam|good (morning|evening|afternoon))\b/)) {
    const devotional = has(t, /radhe|krishna|pranam/);
    return {
      text: `${devotional ? "Radhe Radhe! 🙏" : "Namaste! 🙏"} I'm Sakhi, your companion on Prem Marg. ${SITE.openingQuestion}`,
      chips: starterChips(),
      mood: "joy",
    };
  }
  if (has(t, /\b(thank|thanks|dhanyavad|shukriya)\b/)) {
    return { text: "It's my joy. Walk gently today — and come back whenever you like. 🪔", mood: "joy" };
  }
  if (has(t, /\b(bye|goodbye|good night|see you)\b/)) {
    return { text: "Go well. May your path be clear and your heart light. Radhe Radhe. 🪔", mood: "joy" };
  }
  if (has(t, /\bhow are you\b/)) {
    return { text: "Bright and steady, like a lamp in a still room — thank you for asking. How is your heart today?", chips: starterChips() };
  }
  if (has(t, /\b(who|what) are you\b|\byour name\b|\bare you (a )?(human|real|guru|robot|ai)\b/)) {
    return {
      text: "I'm Sakhi — a companion, not a guru. I'm an AI guide who lives here on Prem Marg: I can calculate your numbers and chart snapshot, read Gita and Katha with you, look at your home's Vastu, and connect you with a real human advisor when a decision deserves one. Every fact I show is calculated, never guessed.",
      chips: ["What can you do?", "Show me around", "Today's Gita verse"],
    };
  }
  if (has(t, /\bwhat can you do\b|\bhelp me\b$|\bhow does this work\b|\bhow do you work\b/)) {
    return {
      text: "Here's how I can help: ✦ a free DRISHTI snapshot from your birth details ✦ your Mulank, Bhagya Ank and home number ✦ a Vastu preview of your floor plan ✦ today's Gita verse and Katha ✦ Gurukul practices for anger, fear, money, relationships and more ✦ a bridge to RadheyShyam Realtor for property decisions. Just ask in your own words.",
      chips: starterChips(),
    };
  }

  // 4. Settings and tour.
  if (has(t, /\b(be quiet|stop talking|mute|silence|quiet mode|don'?t speak)\b/)) {
    return { text: "I'll stay quiet — no voice and no whispers. Call me any time.", settings: { voice: false, whispers: false } };
  }
  if (has(t, /\b(speak|talk to me|voice on|read (it )?aloud|use your voice|unmute)\b/)) {
    return { text: "With pleasure — I'll speak my replies aloud now.", settings: { voice: true } };
  }
  if (has(t, /\b(tour|show me around|guide me|walk me through)\b/)) {
    return { text: "Let me show you around. Follow my light. ✨", tour: true, navigate: ctx.path === "/" ? undefined : "/" };
  }

  // 4b. Explicit navigation ("take me to…", "open…").
  const nav: Array<[RegExp, string]> = [
    [/\bsnapshot\b/, "/drishti#snapshot"],
    [/\b(tiers|reports?|pricing)\b/, "/drishti#tiers"],
    [/\bdrishti\b/, "/drishti"],
    [/\bvastu\b/, "/vastu"],
    [/\bank\b|numbers?\b/, "/ank"],
    [/\bkatha\b/, "/katha"],
    [/\bgita\b/, "/gita"],
    [/\bgurukul\b/, "/gurukul"],
    [/\bmembership\b/, "/membership"],
    [/\b(advisory|realtor|radheyshyam)\b/, "/advisory"],
    [/\b(meet sakhi|sakhi page|brand kit)\b/, "/sakhi"],
    [/\bmy prem marg|my account|my profile|dashboard\b/, "/my"],
    [/\b(about|philosophy|founder|mission)\b/, "/about"],
    [/\bhome ?page|start\b/, "/"],
  ];
  if (has(t, /\b(go to|take me|open|navigate)\b/)) {
    for (const [re, href] of nav) if (re.test(t)) return { text: "Taking you there now. ✨", navigate: href };
  }
  // 5. Policies (non-negotiables, blueprint §3).
  if (has(t, /\b(gem|gemstone|stone|ruby|emerald|sapphire|neelam|pukhraj|ratna|crystal)\b/)) {
    return {
      text: "Prem Marg doesn't prescribe gemstones casually. Stones are costly and their effects are a matter of faith rather than evidence, so we lead with things that reliably help: discipline, clean speech, service, prayer and timing. If a gemstone is ever discussed, it's in a full human consultation — never as a quick fix.",
      chips: ["What remedies do you suggest?", "Book a human consultation"],
    };
  }
  if (has(t, /\b(change (my )?name|name change|spelling change|name numerology|lucky name)\b/)) {
    return {
      text: "We don't do name-changing numerology — no spelling tweaks or artificial corrections. Your name carries your family and your story. What we can do is show your Mulank and Bhagya Ank honestly, with strengths and watch-outs.",
      chips: ["Calculate my Mulank", "Calculate my Bhagya Ank"],
    };
  }
  if (has(t, /\blucky number\b|\blucky (colou?r|day)\b/)) {
    return {
      text: "I don't sell lucky numbers — no number is absolutely good or bad. Your Mulank and Bhagya Ank describe tendencies you can work with. Tell me your date of birth and I'll calculate both.",
      chips: ["My birthday is 14 March 1990"],
    };
  }
  if (has(t, /\b(remed(y|ies)|upay|upaya|what should i do to improve|how (can|do) i improve)\b/)) {
    return {
      text: "Prem Marg's remedies begin with you, not with things to buy: discipline, clean speech, service, gratitude and prayer — and acting with your timing rather than against it. For a home, we go behaviour first, then layout, then colour or material, and renovation only last, with an architect. A DRISHTI reading gives remedies specific to your chart, always positive and never fear-based.",
      cards: [routeCard("drishti")],
      chips: ["Today's Gita verse", "Look at my home's Vastu"],
    };
  }
  if (has(t, /\b(manglik|mangal dosh|kaal ?sarp|sade ?sati|pitra dosh|dosha|curse|black magic|evil eye|nazar|bad luck|unlucky)\b/)) {
    return {
      text: "Please don't carry fear about this. Traditional terms like these describe patterns to understand — not sentences passed on your life. Many people with them live wonderful lives. Prem Marg never sells remedies through fear. A calm, complete reading in DRISHTI will show the real context, along with simple, positive practices.",
      cards: [routeCard("drishti")],
      chips: ["Get my free snapshot"],
    };
  }
  if (has(t, /\bwhen will i die\b|\bhow long will i live\b|\bdeath date\b|\bmy death\b/)) {
    return {
      text: "That isn't something I'll predict — no honest system should. What I can help with is how to live these days well: clearly, kindly, with purpose. Shall we look at today's Gita verse together?",
      cards: [{ kind: "verse", id: pickDaily(GITA, ctx.now).id }],
    };
  }

  // 6. ANK — numbers.
  const homeNum = parseHomeNumber(text);
  if (homeNum && has(t, /\b(house|home|flat|apartment|apt|door|plot|villa|unit|address)\b/)) {
    try {
      const r = homeNumber(homeNum);
      const ignored = r.ignored ? ` I've used the digits only — "${r.ignored}" isn't counted in this method.` : "";
      return {
        text: `Your home number ${homeNum} → ${r.digits.join("+")} = ${r.chain.join(" → ")}. Compound ${r.compound} / Root ${r.root}.${ignored}`,
        cards: [{ kind: "ank", items: [ankItem("Home Number", homeNum, r, "home")] }],
        chips: ["Add my Mulank too", "Open the Vastu studio"],
      };
    } catch {
      /* fall through */
    }
  }
  const date = parseDate(text);
  const wantsAnk = has(t, /\b(mulank|moolank|bhagya|destiny number|life path|numerolog|my number|psychic number|root number|ank)\b/);
  if (wantsAnk || (date && has(t, /\b(birthday|born|dob|date of birth)\b/) && !has(t, /\b(chart|kundli|snapshot|nakshatra|rashi|lagna|horoscope|dasha)\b/))) {
    if (date) {
      const m = mulank(date.day);
      const b = bhagyaAnk(date.year, date.month, date.day);
      return {
        text: `For ${date.day} ${MONTH[date.month - 1]} ${date.year}: your Mulank is ${m.root} and your Bhagya Ank is ${b.root} (compound ${b.compound}). Numbers are a mirror, not a verdict — here's what they reflect.`,
        cards: [{ kind: "ank", items: [ankItem("Mulank", `Day ${date.day}`, m, "personal"), ankItem("Bhagya Ank", `${date.day}·${date.month}·${date.year}`, b, "personal")] }],
        chips: ["What's my home number?", "Get my free snapshot"],
        mood: "joy",
      };
    }
    const dayOnly = parseDayOnly(text);
    if (dayOnly) {
      const m = mulank(dayOnly);
      return {
        text: `Born on the ${dayOnly}${ordinal(dayOnly)}: your Mulank is ${m.root}. For your Bhagya Ank I'll need the full date.`,
        cards: [{ kind: "ank", items: [ankItem("Mulank", `Day ${dayOnly}`, m, "personal")] }],
      };
    }
    return {
      text: "Happily! Tell me your date of birth — for example, 14 March 1990 — and I'll calculate your Mulank and Bhagya Ank. For a home, tell me the house number.",
      chips: ["14 March 1990", "My house number is 607"],
    };
  }

  // 7. Live sky.
  if (has(t, /\b(moon (now|today)|where is the moon|today'?s nakshatra|nakshatra today|tithi|panchang|today'?s moon)\b/)) {
    return { text: "Here's the sky right now — calculated live, this moment.", cards: [{ kind: "sky" }] };
  }

  // 8. DRISHTI — chart & life questions.
  const wantsChart = has(t, /\b(kundli|kundali|birth chart|chart|horoscope|janam|jathakam|rashi|moon sign|nakshatra|lagna|ascendant|dasha|mahadasha|antardasha|astrolog|jyotish|snapshot|planet)/);
  const lifeQ = has(t, /\b(career|job|promotion|business|marriage|married|love life|wealth|rich|future|timing|foreign|abroad|settle|children|education|when will)\b/);
  if (wantsChart || lifeQ) {
    if (date) {
      const pending: PendingSnapshot = { intent: "snapshot", date: { year: date.year, month: date.month, day: date.day } };
      return continueSnapshot(text, pending, ctx);
    }
    if (has(t, /\b(price|cost|how much|tiers?|plans?)\b/)) return productsReply();
    return {
      text: lifeQ
        ? "That's a question about nature and timing — exactly what DRISHTI reads. Let's begin with your free snapshot right here. What is your date of birth?"
        : "Gladly. I'll calculate your free snapshot — Lagna, Moon sign, Nakshatra and your current Mahadasha. What is your date of birth?",
      pending: { intent: "snapshot" },
      chips: ["Cancel"],
      mood: "attentive",
    };
  }

  // 9. VASTU.
  for (const [re, room] of ROOM_WORDS) {
    if (re.test(t) && has(t, /\b(vastu|vaastu|direction|where should|which (side|direction|corner)|facing|placed?|position|zone|north|south|east|west)\b/)) {
      return {
        text: "Here is the traditional guidance — offered as guidance, never as fear. For your actual home, the Vastu studio measures it properly.",
        cards: [{ kind: "vastu-rule", room }],
        chips: ["Open the Vastu studio"],
      };
    }
  }
  if (has(t, /\b(vastu|vaastu|floor ?plan|brahmasthan|my home'?s energy|house layout)\b/)) {
    return {
      text: "Let's look at your home. In the Vastu studio you upload a floor plan, confirm North, the boundary and your rooms — then I'll show its Brahmasthan, zones and first findings. (It's in Beta, so every finding shows its confidence.)",
      cards: [routeCard("vastu")],
    };
  }

  // 10. Wisdom.
  const verseRef = parseVerseRef(text);
  if (verseRef) {
    const v = gitaById(verseRef);
    if (v) return { text: `Bhagavad Gita ${v.id} — ${v.chapterName}.`, cards: [{ kind: "verse", id: v.id }] };
    return { text: `I don't have ${verseRef} in my daily library yet — here is today's verse instead.`, cards: [{ kind: "verse", id: pickDaily(GITA, ctx.now).id }] };
  }
  if (has(t, /\banother verse\b/)) {
    const v = GITA[Math.floor(Math.random() * GITA.length)];
    return { text: "Here's another.", cards: [{ kind: "verse", id: v.id }], chips: ["Another verse"] };
  }
  if (has(t, /\b(gita|geeta|verse|shloka|sloka|krishna said|bhagavad)\b/)) {
    const v = pickDaily(GITA, ctx.now);
    return { text: "Today's verse — read it slowly, once aloud if you can.", cards: [{ kind: "verse", id: v.id }], chips: ["Another verse", "Today's Katha"] };
  }
  if (has(t, /\b(katha|story|stories|tell me a story)\b/)) {
    const k = pickDaily(KATHAS, ctx.now, 3);
    return { text: "Today's Katha — a short story with a lesson for now.", cards: [{ kind: "katha", slug: k.slug }], chips: ["Today's Gita verse"] };
  }

  // 11. Devotional practice.
  if (has(t, /\b(radha naam|naam jap|jap|japa|mantra|chant|meditat|prayer|pray|sattvic|bhajan|kirtan)\b/)) {
    return {
      text: "A simple daily practice many on Prem Marg love: sit quietly for ten minutes and softly repeat “Radhe Radhe” — let the name steady the breath and soften the heart. Keep food sattvic, speech clean, and offer the day with gratitude. These are devotional practices; they nourish the spirit and complement, never replace, medical care.",
      cards: [{ kind: "gurukul", slug: "discipline" }],
    };
  }

  // 12. Feelings → Gurukul.
  for (const [re, slug, line] of FEELINGS) {
    if (re.test(t) && GURUKUL.some((g) => g.slug === slug)) {
      const sad = /sad|down|low|depress|hopeless|grief|griev|heartbroken/.test(t);
      return {
        text: sad ? `${line} If this heaviness stays for weeks, please also talk to a doctor or counsellor — that's strength, not weakness.` : line,
        cards: [{ kind: "gurukul", slug }],
        mood: "attentive",
      };
    }
  }

  // 13. Commerce, membership, advisory.
  if (has(t, /\b(property|real estate|realtor|(buy|buying|purchase|purchasing|sell|selling) (a |an |my )?(new )?(house|home|flat|plot|land|apartment|villa|property)|invest in (land|property)|rent(ing)?|advisor|advisory|consultation|talk to (a )?(human|person|someone)|human)\b/)) {
    return {
      text: "For property decisions and personal consultations, a real person should be beside you. RadheyShyam Realtor offers Private Advisory — your request goes straight to them, privately.",
      cards: [{ kind: "advisory" }],
    };
  }
  if (has(t, /\b(price|prices|pricing|cost|how much|fee|charges|paid|buy|purchase|report)\b/)) return productsReply();
  if (has(t, /\b(member|membership|subscribe|subscription|copper|gold plan|platinum)\b/)) {
    return {
      text: "Membership keeps Prem Marg with you every day — Copper, Gold and Platinum. Final prices are being set carefully after launch so they're fair; you can join the early list now.",
      cards: [{ kind: "links", links: [{ label: "See membership", href: "/membership" }] }],
    };
  }
  if (has(t, /\b(order|my report|payment|refund|receipt|invoice)\b/)) {
    return {
      text: "Your saved profiles and reports live in My Prem Marg. I never guess an order or payment state — when checkout is live, I'll show you exactly what the system confirms.",
      cards: [{ kind: "links", links: [{ label: "Open My Prem Marg", href: "/my" }] }],
    };
  }

  if (has(t, /\b(prem marg|about (this|the) (site|platform)|who (made|built|runs)|founder)\b/)) {
    return {
      text: `Prem Marg means “the path of love”. It's a global dharmic guidance platform by ${SITE.founderBrand}: astrology, Vastu and numerology are entry doors; Katha, Gita and Gurukul are the home you grow in. Our promise is guidance without fear.`,
      cards: [{ kind: "links", links: [{ label: "Our philosophy", href: "/about" }] }],
    };
  }

  // 15. Clarity words alone ("career", "home"...).
  const clar = CLARITY.find((c) => t === c.label.toLowerCase() || t === c.key);
  if (clar) return { text: clar.sakhi, cards: [routeCard(clar.route, clar.href, clar.cta)] };

  // 16. Nothing confident — let the model layer interpret (it never calculates).
  return {
    text: "I want to answer that well. Could you tell me a little more — is it about you, your home, your numbers, or your inner life?",
    chips: starterChips(),
    deferToModel: true,
  };
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function starterChips(): string[] {
  return ["My free DRISHTI snapshot", "Calculate my Mulank", "Today's Gita verse", "Look at my home's Vastu"];
}

function productsReply(): BrainReply {
  return {
    text: "Here's everything, plainly — no pressure. DRISHTI reports are $200, $250 and $350. Every free tool stays free. Choose only if it truly helps you.",
    cards: [{ kind: "products" }],
  };
}

function routeCard(pillar: "drishti" | "vastu" | "ank" | "katha" | "gita" | "gurukul", href?: string, cta?: string) {
  const map = {
    drishti: { title: "DRISHTI — free snapshot", text: "Lagna, Moon, Nakshatra and your current life period.", href: "/drishti#snapshot", cta: "Open DRISHTI" },
    vastu: { title: "VASTU studio (Beta)", text: "Floor plan → North → boundary → rooms → findings.", href: "/vastu", cta: "Open the studio" },
    ank: { title: "ANK calculators", text: "Mulank, Bhagya Ank and Home Number — free.", href: "/ank", cta: "Open ANK" },
    katha: { title: "Today's Katha", text: "A sacred story with a practical lesson.", href: "/katha", cta: "Read Katha" },
    gita: { title: "Today's Gita verse", text: "Sanskrit, meaning, reflection and one action.", href: "/gita", cta: "Read the verse" },
    gurukul: { title: "Gurukul", text: "Seven-day practices for real life.", href: "/gurukul", cta: "Enter Gurukul" },
  } as const;
  const m = map[pillar];
  return { kind: "route" as const, pillar, title: m.title, text: m.text, href: href ?? m.href, cta: cta ?? m.cta };
}
