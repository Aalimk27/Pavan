"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_PRIMARY, NAV_SECONDARY, PILLARS } from "@/lib/site";
import { sakhi } from "@/components/sakhi/bus";
import Wordmark from "./Wordmark";
import "./layout.css";

export default function Header() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}${menu ? " is-menu" : ""}`}>
        <div className="site-header__inner">
          <Link href="/" className="site-header__brand" aria-label="Prem Marg — home">
            <Wordmark />
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {NAV_PRIMARY.map((n) => (
              <Link key={n.href} href={n.href} className={`site-nav__link${active(n.href) ? " is-active" : ""}`}>
                {n.label}
                {"beta" in n && n.beta && <sup className="site-nav__beta">β</sup>}
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link href="/my" className={`site-header__my${active("/my") ? " is-active" : ""}`}>
              My Prem Marg
            </Link>
            <button type="button" className="btn btn--sm site-header__ask" onClick={() => sakhi.open()}>
              Ask Sakhi
            </button>
            <button type="button" className="site-header__burger" aria-expanded={menu} aria-controls="site-menu" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu((m) => !m)}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" className={`site-menu${menu ? " is-open" : ""}`} aria-hidden={!menu} inert={!menu || undefined}>
        <div className="site-menu__inner">
          <p className="eyebrow">Six doors</p>
          <ul className="site-menu__pillars">
            {PILLARS.map((p, i) => (
              <li key={p.key} style={{ ["--i" as string]: i }}>
                <Link href={p.href}>
                  <span className="site-menu__dev">{p.devanagari}</span>
                  <span className="site-menu__name">
                    {p.name}
                    {p.beta && <small> Beta</small>}
                  </span>
                  <span className="site-menu__kind">{p.kind}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="site-menu__secondary">
            {NAV_SECONDARY.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn--lg"
            onClick={() => {
              setMenu(false);
              sakhi.open();
            }}
          >
            Talk to Sakhi
          </button>
        </div>
      </div>
    </>
  );
}
