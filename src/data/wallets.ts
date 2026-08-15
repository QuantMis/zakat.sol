import type { WalletOption } from "@/lib/types";

/** Phantom is the only wallet we support for now. */
export const phantom: WalletOption = {
  id: "phantom",
  name: "Phantom",
  installUrl: "https://phantom.app/download",
};
