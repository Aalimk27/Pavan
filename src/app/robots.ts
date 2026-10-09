import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes and the on-device "My Prem Marg" dashboard have nothing to index.
        disallow: ["/api/", "/my"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
