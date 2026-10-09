# PREM MARG — A Better Way to Live

**premarga.com · by RadheyShyam Realtor · guided by SAKHI**

A global dharmic guidance platform that turns timeless wisdom and traditional systems into clearer thinking, better choices and better action — without fear.

```
DRISHTI • VASTU • ANK • KATHA • GITA • GURUKUL
```

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # deterministic-engine regression tests
npm run typecheck
npm run build && npm start
```

Node 22.6+ (tests use `--experimental-strip-types`). Copy `.env.example` to `.env.local` to switch on integrations — every one is optional; the site runs fully without them.

| Variable | Turns on |
| --- | --- |
| `OPENAI_API_KEY`, `SAKHI_MODEL`, `OPENAI_BASE_URL` | Sakhi's model layer for open-ended questions (interpretation only) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe Checkout + webhooks |
| `RESEND_API_KEY`, `EMAIL_FROM`, `ADVISORY_INBOX` | Transactional email, daily-wisdom sign-ups, advisory requests |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager → GA4 funnel events |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Stripe return URLs |

---

## SAKHI — the living companion

Sakhi lives on every page. She is not a chat widget; she is a presence.

- **The icon is alive.** Her gaze (the gold *bindu*) follows your pointer, she blinks naturally, her eye wanders when you're still, she rests when you go idle and wakes when you return, and her light pulses with every word she speaks.
- **Moods:** idle · attentive · listening (ripples) · thinking (orbit) · speaking · joy (the lotus opens) · resting.
- **She notices.** Linger on anything marked `data-sakhi="…"` and she glances at it and whispers an explanation. She greets you once on each page you visit.
- **She guides.** "Show me around" starts a spotlight tour; she flies beside each stop.
- **She does things.** Calculates Mulank / Bhagya Ank / home numbers, runs a full DRISHTI snapshot by asking for date → time → place, reads today's Gita verse and Katha, answers Vastu placement questions, routes feelings to Gurukul practices, escalates property decisions to Private Advisory, and responds to crisis language with care and helplines first.
- **Voice:** she can speak (Web Speech API, Indian-English voice preferred) and listen (speech recognition where supported). Press **/** anywhere to call her; **Esc** to close.
- **Truth rule:** every number, position and date comes from the deterministic engines. The optional model layer (`/api/sakhi`) only interprets; it never calculates.

Any component can talk to her:

```ts
import { sakhi } from "@/components/sakhi/bus";
sakhi.whisper("That's your Bhagya Ank.", { selector: "#bhagya" });
sakhi.open("What is my Mulank if I was born on 29 May 1992?");
sakhi.celebrate();
sakhi.guide([{ selector: "#snapshot", text: "Start here." }]);
```

### Brand mark

`src/components/sakhi/geometry.ts` is the single source of truth for the icon: **Jyoti** (the flame), **Drishti** (the peacock-feather eye), **Prem** (its heart-shaped core — real peacock eyespots have one), the **Bindu** that follows you, and the **Kamala** lotus seat. Export every variant with:

```bash
node --experimental-strip-types scripts/export-brand.ts
```

writes `public/brand/sakhi-mark{,-simple,-gold,-ink,-ivory}.svg`, `sakhi-app-icon.svg` and the favicon.

---

## Deterministic engines (blueprint §11: "Facts are generated deterministically")

| Engine | File | Notes |
| --- | --- | --- |
| DRISHTI snapshot | `src/lib/astro/engine.ts` | Sidereal (Lahiri) Moon, Sun, Lagna; nakshatra + pada; Vimshottari Maha/Antar dasha; tithi. Meeus algorithms. **Regression-tested against Swiss Ephemeris on 60 charts: Moon ±0.003°, Sun ±0.013°, Lagna ±0.004°.** |
| Time zones | `src/lib/astro/time.ts` | Local birth time → UTC with historical offsets/DST via `Intl` |
| Birthplaces | `src/lib/astro/cities.ts` | ~180 cities across India and the diaspora; manual coordinates for anywhere else |
| ANK | `src/lib/ank.ts` | Mulank, Bhagya Ank, Home Number — compound **and** root preserved (607 → 13 → 4) |
| VASTU (Beta) | `src/lib/vastu/engine.ts` | Brahmasthan (area centroid), 8/16 zones, 3×3 mandala, cut detection, frozen placement rules, remedy hierarchy, confidence per finding |
| Sakhi parsing | `src/lib/sakhi/parse.ts` | Dates/times/house numbers/verse references as people actually type them |

Versions (`CALC_VERSION`, `VASTU_RULES_VERSION`) are stamped for reproducibility (§19).

## Content

`src/lib/content/` — 33 Bhagavad Gita verses (Devanagari + IAST, checked against two datasets derived from IIT Kanpur's Gita Supersite), 16 Katha stories with honest sourcing, 13 Gurukul topics with seven-day practices. Daily rotation is by UTC date, so the whole world reads the same verse and story on the same day.

## Map of the site

| Route | Blueprint |
| --- | --- |
| `/` | §4 Home — opening question, clarity selector, six doors, free tools, daily wisdom, the path, the no-fear promise |
| `/drishti` | §6 free snapshot + Core $200 / Deep $250 / Signature $350, 13-slide standard |
| `/vastu` | §7 floor-plan studio (Beta) |
| `/ank` | §8 calculators + convergence |
| `/katha`, `/gita`, `/gurukul` | §9 retention engine |
| `/sakhi` | §10 Meet Sakhi + brand kit |
| `/membership`, `/my`, `/advisory` | §14, My Prem Marg, Private Advisory |
| `/about`, `/legal/*` | Philosophy, Seva, privacy, terms, traditional-practice disclaimer |
| `/api/*` | Sakhi model layer, checkout, Stripe webhook, subscribe, advisory |

## Before go-live (blueprint §26)

Honest list of what still needs the founder or real accounts:

- Domain ownership + trademark screening for **premarga.com**.
- Final prices for VASTU report, ANK convergence and memberships (currently "Launch pricing soon").
- Stripe account + webhook secret; order persistence (Supabase) behind the marked integration point in the webhook.
- Passwordless accounts (My Prem Marg is local-first on the device today).
- Full report generation pipeline (13-slide DRISHTI render, annotated Vastu PDF).
- Legal review of the draft privacy policy, terms and disclaimer.
- GA4/GTM container and purchase-event verification.
- Founder's note on the Philosophy page.
- Real member testimonials (the homepage deliberately shows none until they exist).
