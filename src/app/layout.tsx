import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Manrope, Marcellus, Tiro_Devanagari_Sanskrit } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/layout/Reveal";
import SakhiProvider from "@/components/sakhi/SakhiProvider";
import { SITE } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], variable: "--font-fraunces", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });
const tiro = Tiro_Devanagari_Sanskrit({ subsets: ["devanagari", "latin"], weight: "400", style: ["normal", "italic"], variable: "--font-tiro", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.promise}`,
    template: `%s · ${SITE.short}`,
  },
  description: SITE.definition,
  applicationName: SITE.short,
  keywords: ["Vedic astrology", "Vastu", "numerology", "Mulank", "Bhagya Ank", "Bhagavad Gita", "Katha", "Gurukul", "dharmic guidance", "Sakhi"],
  openGraph: {
    type: "website",
    siteName: SITE.short,
    title: `${SITE.name} — ${SITE.promise}`,
    description: SITE.definition,
    url: SITE.url,
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Prem Marg — guided by Sakhi" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/og.png"] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#062a1c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const GTM = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable} ${marcellus.variable} ${tiro.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {GTM && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
          </Script>
        )}
        <SakhiProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Reveal />
        </SakhiProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Prem Marg",
              url: SITE.url,
              slogan: SITE.promise,
              description: SITE.definition,
              logo: `${SITE.url}/brand/sakhi-app-icon.svg`,
              parentOrganization: { "@type": "Organization", name: SITE.founderBrand, url: SITE.founderUrl },
            }),
          }}
        />
      </body>
    </html>
  );
}
