import { HeaderShell } from "@/components/layout/header-shell";
import { WalletBadge } from "@/components/layout/wallet-badge";

/**
 * The dashboard's only chrome. There is one screen behind it now — zakat is
 * owed per year, and each year carries its own holdings — so there is nothing
 * left to navigate between and no nav to put here. The mark goes home; the
 * badge says whose wallet is being read.
 */
export function DashboardTopBar() {
  return (
    <HeaderShell className="sticky top-0 z-30 bg-cream-soft/95 backdrop-blur print:hidden">
      <WalletBadge />
    </HeaderShell>
  );
}
