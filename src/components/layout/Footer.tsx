import Link from "next/link";
import Image from "next/image";
import { PILLARS, SITE } from "@/lib/site";
import Wordmark from "./Wordmark";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Wordmark size={54} live={false} />
            <p className="site-footer__def">{SITE.definition}</p>
          </div>
          <div className="site-footer__cols">
            <div>
              <p className="site-footer__h">The six doors</p>
              <ul>
                {PILLARS.map((p) => (
                  <li key={p.key}>
                    <Link href={p.href}>
                      {p.name}
                      {p.beta && <span className="site-footer__beta"> Beta</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="site-footer__h">Prem Marg</p>
              <ul>
                <li>
                  <Link href="/sakhi">Meet Sakhi</Link>
                </li>
                <li>
                  <Link href="/membership">Membership</Link>
                </li>
                <li>
                  <Link href="/my">My Prem Marg</Link>
                </li>
                <li>
                  <Link href="/advisory">Private Advisory</Link>
                </li>
                <li>
                  <Link href="/about">Philosophy & Seva</Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="site-footer__h">Trust</p>
              <ul>
                <li>
                  <Link href="/legal/disclaimer">Traditional-practice disclaimer</Link>
                </li>
                <li>
                  <Link href="/legal/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/legal/terms">Terms</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="site-footer__line">
          <p className="inscription site-footer__pillars">DRISHTI • VASTU • ANK • KATHA • GITA • GURUKUL</p>
          <p className="site-footer__guided">
            Guided by <strong>SAKHI</strong> • by{" "}
            <a href={SITE.founderUrl} target="_blank" rel="noreferrer">
              RadheyShyam Realtor
            </a>
          </p>
          <a className="site-footer__rsr" href={SITE.founderUrl} target="_blank" rel="noreferrer" aria-label="RadheyShyam Realtor">
            <Image src="/brand/radheyshyam-realtor.png" alt="RadheyShyam Realtor" width={220} height={68} />
          </a>
        </div>

        <div className="site-footer__legal">
          <p>
            Traditional guidance for reflection and self-understanding. It does not replace medical, mental-health, legal, financial or structural professional advice. Devotional recommendations are offered as
            devotional practice, not scientific claims.
          </p>
          <p>
            © {new Date().getFullYear()} {SITE.short} · {SITE.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
