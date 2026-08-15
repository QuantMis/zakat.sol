import { CalculationTopBar } from "@/components/calculation/calculation-top-bar";
import { YearTable } from "@/components/calculation/year-table";

export const metadata = {
  title: "Zakatable Wealth",
};

export default function CalculationPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <CalculationTopBar />

      <div className="flex flex-1 flex-col p-5 lg:p-8">
        <YearTable />
      </div>
    </div>
  );
}
