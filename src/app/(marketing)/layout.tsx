import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ConnectWalletProvider } from "@/components/wallet/connect-wallet-provider";

/**
 * Shell for the public pages. `overflow-x-clip` rather than `overflow-hidden`
 * so the hero backdrop stays clipped without turning this into a scroll
 * container — that would break the sticky contents list on /privacy.
 */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <ConnectWalletProvider>
      <div className="relative flex flex-1 flex-col overflow-x-clip bg-white">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
    </ConnectWalletProvider>
  );
}
