import type { ZakatYear } from "@/lib/types";

/**
 * Settled years for this wallet. The current year is derived from the live
 * calculation rather than stored here — see `useZakatHistory`.
 */
export const settledYears: ZakatYear[] = [
  {
    id: "1447",
    hijriYear: "1447 AH",
    gregorianYear: "2025",
    calculatedAt: "2025-08-27T09:12:00.000Z",
    netWealth: 48195.2,
    zakat: 1204.88,
    status: "paid",
  },
  {
    id: "1446",
    hijriYear: "1446 AH",
    gregorianYear: "2024",
    calculatedAt: "2024-09-06T18:40:00.000Z",
    netWealth: 28496,
    zakat: 712.4,
    status: "paid",
  },
];
