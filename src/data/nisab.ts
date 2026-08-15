import type { MetalPrices } from "@/lib/types";

/** Metal prices behind the nisab threshold; refreshed hourly in production. */
export const metalPrices: MetalPrices = {
  goldPerGram: 114.2,
  silverPerGram: 3.43,
  updatedAt: "2026-08-15T12:00:00.000Z",
};

/** Previous hawl — the period the current calculation covers. */
export const hawlCompleted = "2026-02-18T00:00:00.000Z";
