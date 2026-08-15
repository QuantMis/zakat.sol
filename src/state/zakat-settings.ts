"use client";

import { useSyncExternalStore } from "react";

import * as store from "@/state/settings-store";
import type { ZakatSettings } from "@/lib/types";

const actions = {
  update: store.update,
  setRule: store.setRule,
  toggleAsset: store.toggleAsset,
  addLiability: store.addLiability,
  removeLiability: store.removeLiability,
  reset: store.reset,
};

export function useZakatSettings(): { settings: ZakatSettings } & typeof actions {
  const settings = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  return { settings, ...actions };
}
