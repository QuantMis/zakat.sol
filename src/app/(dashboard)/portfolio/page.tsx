import Link from "next/link";

import { AssetTable } from "@/components/portfolio/asset-table";
import { PortfolioStats } from "@/components/portfolio/portfolio-stats";
import { PortfolioTopBar } from "@/components/portfolio/portfolio-top-bar";
import { buttonStyles } from "@/components/ui/button";

export const metadata = {
  title: "Portfolio",
};

export default function PortfolioPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <PortfolioTopBar />

      <div className="flex flex-1 flex-col gap-5.5 p-5 lg:p-8">
        <PortfolioStats />
        <AssetTable />

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-line bg-cream px-5 py-4">
          <p className="text-[13.5px] text-muted">
            Debts and liabilities are entered on the next step.
          </p>
          <Link href="/calculation" className={buttonStyles("primary")}>
            Calculate zakat →
          </Link>
        </div>
      </div>
    </div>
  );
}
