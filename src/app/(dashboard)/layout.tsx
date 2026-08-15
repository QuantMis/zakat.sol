import { Suspense, type ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { ScanSync } from "@/components/portfolio/scan-sync";
import { ConnectWalletProvider } from "@/components/wallet/connect-wallet-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ConnectWalletProvider>
      {/* Reads the address out of the query string, which is a request-time value. */}
      <Suspense fallback={null}>
        <ScanSync />
      </Suspense>

      <div className="flex flex-1 bg-white">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileNav />
          {children}
        </div>
      </div>
    </ConnectWalletProvider>
  );
}
