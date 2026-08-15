import { BreakdownPanel } from "@/components/calculation/breakdown-panel";
import { CalculationHeading } from "@/components/calculation/calculation-heading";
import { DeductionsPanel } from "@/components/calculation/deductions-panel";
import { EndorsementCard } from "@/components/calculation/endorsement-card";
import { ZakatSummaryCard } from "@/components/calculation/zakat-summary-card";

export const metadata = {
  title: "Calculation",
};

export default function CalculationPage() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-5 lg:flex-row lg:gap-0 lg:p-8">
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <CalculationHeading />
        <BreakdownPanel />
        <DeductionsPanel />
      </div>

      <aside className="flex w-full flex-col gap-3.5 lg:w-[400px] lg:shrink-0 lg:pl-8">
        <ZakatSummaryCard />

        <div className="flex flex-col gap-2 rounded-[14px] border border-line bg-white p-4.5">
          <p className="text-[13.5px] font-semibold">Pay it where you like</p>
          <p className="text-[13px] leading-relaxed text-muted">
            We don&apos;t take custody or route donations. Take the report to whichever charity you
            already trust.
          </p>
        </div>

        <EndorsementCard />
      </aside>
    </div>
  );
}
