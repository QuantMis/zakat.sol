import { HeaderShell } from "@/components/layout/header-shell";

/**
 * Mark only. Connecting a wallet is offered beside the address field in the
 * hero, where the choice between pasting and connecting is actually made —
 * a second button up here would be the same action asked for twice.
 */
export function SiteHeader() {
  return <HeaderShell className="relative z-10 bg-cream-soft" />;
}
