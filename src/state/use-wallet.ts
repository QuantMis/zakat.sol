"use client";

import { useSyncExternalStore } from "react";

import * as store from "@/state/wallet-store";
import type { WalletState } from "@/state/wallet-store";

const actions = {
  connect: store.connect,
  disconnect: store.disconnect,
};

export function useWallet(): WalletState & typeof actions {
  const wallet = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  return { ...wallet, ...actions };
}
