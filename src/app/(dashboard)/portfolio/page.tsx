import { AssetTable } from "@/components/portfolio/asset-table";
import { PortfolioTopBar } from "@/components/portfolio/portfolio-top-bar";

export const metadata = {
  title: "My Portfolio",
};

export default function PortfolioPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <PortfolioTopBar />

      <div className="flex flex-1 flex-col p-5 lg:p-8">
        <AssetTable />
      </div>
    </div>
  );
}
