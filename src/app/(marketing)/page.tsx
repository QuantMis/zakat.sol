import { Hero } from "@/components/marketing/hero";
import { PageBackdrop } from "@/components/marketing/page-backdrop";
import { Partners } from "@/components/marketing/partners";
import { References } from "@/components/marketing/references";

export default function LandingPage() {
  return (
    <>
      <PageBackdrop />

      <main className="relative flex flex-col items-center px-5 sm:px-8 lg:px-16">
        <Hero />
        <References />
        <Partners />
      </main>
    </>
  );
}
