import GarmentRack from "@/components/hero/GarmentRack";
import LifestyleStrip from "@/components/sections/LifestyleStrip";
import Marquee from "@/components/sections/Marquee";
import DualWorld from "@/components/sections/DualWorld";
import NewThisWeek from "@/components/sections/NewThisWeek";
import Manifesto from "@/components/sections/Manifesto";

export default function HomePage() {
  return (
    <>
      {/* Above the fold: studio rail + anchored editorial strip */}
      <GarmentRack />
      <LifestyleStrip />

      {/* Below the fold */}
      <Marquee />
      <DualWorld />
      <NewThisWeek />
      <Manifesto />
    </>
  );
}
