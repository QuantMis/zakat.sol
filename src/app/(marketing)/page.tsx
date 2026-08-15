import { EndorsementBanner } from "@/components/marketing/endorsement-banner";
import { Hero } from "@/components/marketing/hero";
import { HeroBackdrop } from "@/components/marketing/hero-backdrop";
import { StatBand } from "@/components/marketing/stat-band";

export default function LandingPage() {
  return (
    <>
      <HeroBackdrop />

      <main className="relative flex flex-col items-center px-5 sm:px-8 lg:px-16">
        <Hero />
        <StatBand />
        <EndorsementBanner />
      </main>
    </>
  );
}
