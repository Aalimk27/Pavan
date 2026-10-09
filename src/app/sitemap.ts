import type { MetadataRoute } from "next";
import { GITA } from "@/lib/content/gita";
import { KATHAS } from "@/lib/content/katha";
import { GURUKUL } from "@/lib/content/gurukul";
import { SITE } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

const STATIC: ReadonlyArray<[path: string, priority: number, freq: Entry["changeFrequency"]]> = [
  ["/", 1, "daily"],
  ["/drishti", 0.9, "weekly"],
  ["/vastu", 0.8, "weekly"],
  ["/ank", 0.9, "weekly"],
  ["/gita", 0.9, "daily"],
  ["/katha", 0.9, "daily"],
  ["/gurukul", 0.8, "weekly"],
  ["/membership", 0.7, "monthly"],
  ["/advisory", 0.6, "monthly"],
  ["/sakhi", 0.7, "monthly"],
  ["/about", 0.7, "monthly"],
  ["/legal", 0.3, "yearly"],
  ["/legal/privacy", 0.3, "yearly"],
  ["/legal/terms", 0.3, "yearly"],
  ["/legal/disclaimer", 0.4, "yearly"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  const url = (p: string) => `${base}${p === "/" ? "" : p}`;

  return [
    ...STATIC.map(([p, priority, changeFrequency]) => ({ url: url(p), lastModified: now, changeFrequency, priority })),
    ...GITA.map((v) => ({ url: url(`/gita/${v.id.replace(".", "-")}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...KATHAS.map((k) => ({ url: url(`/katha/${k.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...GURUKUL.map((g) => ({ url: url(`/gurukul/${g.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
