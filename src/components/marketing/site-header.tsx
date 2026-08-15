import { Logo } from "@/components/layout/logo";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex h-[68px] items-center justify-between gap-6 border-b border-line-soft bg-cream-soft px-5 sm:px-8">
      <Logo className="text-[19px]" markClassName="h-[26px]" />

      <ConnectWalletButton size="sm" className="px-5 py-2.5 text-sm">
        Connect Wallet
      </ConnectWalletButton>
    </header>
  );
}
