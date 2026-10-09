import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import DeepMala from "@/components/ui/DeepMala";
import SakhiNote from "@/components/ui/SakhiNote";
import MyDashboard from "@/components/account/MyDashboard";
import s from "./my.module.css";

export const metadata: Metadata = {
  title: "My Prem Marg — Profiles, Homes & Daily Wisdom",
  description:
    "Your personal space on Prem Marg: saved birth profiles, homes and Vastu previews, Daily Wisdom history, Gurukul progress and Sakhi preferences — saved privately on this device, with export and delete at any time.",
  alternates: { canonical: "/my" },
  robots: { index: false, follow: true },
};

export default function MyPage() {
  return (
    <>
      <PageHero
        eyebrow="My Prem Marg"
        watermark="मेरा मार्ग"
        title={
          <>
            Your path, <em>kept close</em>.
          </>
        }
        lead="Your profiles, homes, daily wisdom and practice — gathered in one quiet place, and saved only on this device."
      >
        <div className={s.mala}>
          <DeepMala tone="dark" />
        </div>
      </PageHero>

      <section className={`section section--tight ${s.body}`}>
        <div className="container">
          <MyDashboard />
          <div className={s.note}>
            <SakhiNote ask="What can I keep in My Prem Marg, and how do I use it?" askLabel="Ask Sakhi how this works">
              This is your corner of Prem Marg. Save a birth profile from DRISHTI, a home from ANK or the Vastu studio, and read the day&rsquo;s verse — I&rsquo;ll keep it all here for you, on
              this device, until sign-in arrives.
            </SakhiNote>
          </div>
        </div>
      </section>
    </>
  );
}
