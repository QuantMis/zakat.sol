import { DashboardLinks } from "@/components/layout/dashboard-links";
import { Logo } from "@/components/layout/logo";
import { WalletBadge } from "@/components/layout/wallet-badge";

export function Sidebar() {
  return (
    <aside className="hidden w-[236px] shrink-0 flex-col gap-7 border-r border-line-soft bg-shell p-4 pt-5.5 print:hidden lg:flex">
      <Logo className="px-2 text-[17px]" />

      <nav className="flex flex-col gap-1">
        <DashboardLinks variant="sidebar" />
      </nav>

      <div className="mt-auto">
        <WalletBadge />
      </div>
    </aside>
  );
}
