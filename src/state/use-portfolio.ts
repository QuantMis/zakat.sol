"use client";

import { useSyncExternalStore } from "react";

import * as store from "@/state/portfolio-store";
import type { PortfolioState } from "@/state/portfolio-store";

/**
 * The scan the dashboard is reporting on: the connected wallet's once Phantom
 * has approved, and the sample until then.
 */
export function usePortfolio(): PortfolioState {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
