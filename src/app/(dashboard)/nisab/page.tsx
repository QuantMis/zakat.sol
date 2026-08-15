import { PageHeading } from "@/components/layout/page-heading";
import { HawlCard } from "@/components/nisab/hawl-card";
import { NisabBasisCard } from "@/components/nisab/nisab-basis-card";
import { TreatmentRulesCard } from "@/components/nisab/treatment-rules-card";

export const metadata = {
  title: "Nisab & dates",
};

export default function NisabPage() {
  return (
    <div className="flex flex-1 flex-col gap-6.5 p-5 lg:px-12 lg:py-10">
      <PageHeading
        title="Nisab & dates"
        subtitle="These settings drive every calculation and are saved to this browser."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <NisabBasisCard />
        <HawlCard />
      </div>

      <TreatmentRulesCard />
    </div>
  );
}
