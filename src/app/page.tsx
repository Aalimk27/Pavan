import { GITA } from "@/lib/content/gita";
import { KATHAS } from "@/lib/content/katha";
import { pickDaily } from "@/lib/daily";
import Hero from "@/components/home/Hero";
import Proposition from "@/components/home/Proposition";
import Doors from "@/components/home/Doors";
import FreeTools from "@/components/home/FreeTools";
import DailyWisdom from "@/components/home/DailyWisdom";
import Path from "@/components/home/Path";
import { Bridge, Voices, Vows } from "@/components/home/Promise";
import Finale from "@/components/home/Finale";

// Daily wisdom rolls over with the day.
export const revalidate = 3600;

export default function Home() {
  const today = new Date();
  const verse = pickDaily(GITA, today, 0);
  const katha = pickDaily(KATHAS, today, 3);
  return (
    <>
      <Hero />
      <Proposition />
      <Doors />
      <FreeTools />
      <DailyWisdom verse={verse} katha={katha} />
      <Path />
      <Vows />
      <Voices />
      <Bridge />
      <Finale />
    </>
  );
}
