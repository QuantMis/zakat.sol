import { DataSources } from "@/components/marketing/data-sources";
import { Hero } from "@/components/marketing/hero";
import { MetricsBand } from "@/components/marketing/metrics-band";
import { References } from "@/components/marketing/references";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center px-5 sm:px-8 lg:px-16">
      <Hero />
      <MetricsBand />
      <References />
      <DataSources />
    </main>
  );
}
