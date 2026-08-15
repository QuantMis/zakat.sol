import { hawlCompleted } from "@/data/nisab";
import { gregorianYear, hijriYear } from "@/lib/format";

/**
 * Zakat falls due once a lunar year — a hawl — has passed over wealth that sat
 * above nisab. So the years this app reports on are lunar years counted back
 * from the hawl the current calculation covers, not calendar years.
 */

/** Mean length of a lunar year. Twelve lunations, not 365 days. */
const LUNAR_YEAR_DAYS = 354.36707;

const DAY_MS = 86_400_000;

/**
 * How far back a reconstruction reaches. Each year costs a round of balance
 * reads per holding, so this is a spending limit as much as a design one.
 */
export const RECONSTRUCTED_YEARS = 5;

export type Hawl = {
  /** Bare hijri year, "1447" — the URL segment for the year's detail page. */
  id: string;
  hijriYear: string;
  gregorianYear: string;
  /** When the hawl completed, and so when its holdings are valued. */
  valuedAt: string;
};

/** "1447 AH" is what the app shows; the URL wants the number on its own. */
export function hawlId(iso: string): string {
  return hijriYear(iso).replace(/\D/g, "");
}

export function toHawl(iso: string): Hawl {
  return {
    id: hawlId(iso),
    hijriYear: hijriYear(iso),
    gregorianYear: gregorianYear(iso),
    valuedAt: iso,
  };
}

/**
 * The hawl anniversaries already passed, newest first. Anchored to the hawl the
 * current calculation covers, so every date is the same point in the lunar year
 * rather than a drifting Gregorian one.
 *
 * The current year is deliberately absent: it comes from the live scan, which
 * knows today's holdings exactly and needs no rebuilding.
 */
export function pastHawls(count = RECONSTRUCTED_YEARS, anchor = hawlCompleted): Hawl[] {
  const completed = new Date(anchor).getTime();

  return Array.from({ length: count }, (_, yearsBack) =>
    toHawl(new Date(completed - yearsBack * LUNAR_YEAR_DAYS * DAY_MS).toISOString()),
  );
}
