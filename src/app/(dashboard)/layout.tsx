import { Suspense, type ReactNode } from "react";

import { DashboardTopBar } from "@/components/layout/dashboard-top-bar";
import { ScanSync } from "@/components/portfolio/scan-sync";
import { ConnectWalletProvider } from "@/components/wallet/connect-wallet-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ConnectWalletProvider>
      {/* Reads the address out of the query string, which is a request-time value. */}
      <Suspense fallback={null}>
        <ScanSync />
      </Suspense>

      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <DashboardTopBar />
        {children}
      </div>
    </ConnectWalletProvider>
  );
}
