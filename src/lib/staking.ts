import { round2, ZAKAT_RATE } from "@/lib/zakat";

/** A hawl is a lunar year — shorter than the year an APY is quoted over. */
export const HAWL_DAYS = 354;

const SOLAR_DAYS = 365;

export type StakeProjection = {
  stakedValue: number;
  yieldSol: number;
  yieldValue: number;
  valueAtHawl: number;
  zakatDue: number;
};

/**
 * Projects a stake forward one hawl. An LST's APY is already compounded into
 * its redemption rate, so growth is the annual figure scaled to 354 days
 * rather than a simple pro-rata slice. Price is held flat: this answers
 * "what does the yield add", not "where is SOL going".
 */
export function projectStake(amountSol: number, apy: number, solPrice: number): StakeProjection {
  const balanceSol = amountSol * (1 + apy) ** (HAWL_DAYS / SOLAR_DAYS);
  const yieldSol = balanceSol - amountSol;
  const valueAtHawl = round2(balanceSol * solPrice);

  return {
    stakedValue: round2(amountSol * solPrice),
    yieldSol,
    yieldValue: round2(yieldSol * solPrice),
    valueAtHawl,
    zakatDue: round2(valueAtHawl * ZAKAT_RATE),
  };
}

/** The share of a year's yield that lands inside one hawl. */
export function hawlApy(apy: number): number {
  return (1 + apy) ** (HAWL_DAYS / SOLAR_DAYS) - 1;
}
