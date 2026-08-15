import type { StakingToken } from "@/lib/types";

export const sanctumUrl = "https://sanctum.so";

/**
 * Sample pool figures, quoted the way the app quotes prices: a snapshot, not a
 * promise. Swap this module for the Sanctum API and the page follows.
 */
export const stakingTokens: StakingToken[] = [
  {
    symbol: "INF",
    name: "Sanctum Infinity",
    apy: 0.0912,
    tvlSol: 1_940_000,
    note: "A basket of the pools below, rebalanced towards whichever is paying best.",
  },
  {
    symbol: "jitoSOL",
    name: "Jito",
    apy: 0.0834,
    tvlSol: 14_200_000,
    note: "Validator yield plus a share of MEV rebates.",
  },
  {
    symbol: "bSOL",
    name: "BlazeStake",
    apy: 0.0791,
    tvlSol: 1_120_000,
    note: "Stake spread across a public, permissionless validator set.",
  },
  {
    symbol: "hSOL",
    name: "Helius",
    apy: 0.0806,
    tvlSol: 640_000,
    note: "Single-operator pool run by the RPC provider.",
  },
  {
    symbol: "dSOL",
    name: "Drift",
    apy: 0.0788,
    tvlSol: 520_000,
    note: "Delegated across a curated validator list.",
  },
];

/** How each part of a stake lands in the report. */
export const stakingTreatments = [
  {
    title: "The token itself",
    detail:
      "Counted in full at market value, exactly like spot SOL. Staking changes what the wealth is doing, not whether you own it.",
  },
  {
    title: "Accrued rewards",
    detail:
      "Already inside the price — an LST becomes redeemable for more SOL over time rather than paying you separately. Adding a rewards line would count it twice.",
  },
  {
    title: "The unstake queue",
    detail:
      "Epoch boundaries and withdrawal queues delay access, not ownership. A delay does not defer the zakat.",
  },
  {
    title: "Validator commission",
    detail:
      "Taken before the yield reaches the pool, so the APY you see is already net of it. It is a cost, not a deductible liability.",
  },
] as const;

export const stakeSteps = [
  {
    title: "Stake in Sanctum",
    detail:
      "Swap SOL for the LST you picked, in Sanctum's app and in your own wallet. Nothing on this page can move funds.",
  },
  {
    title: "Scan the same address",
    detail:
      "The LST lands in the wallet you already scan. It is priced at market like every other mint, so the staked value stays in the report.",
  },
  {
    title: "Pay on the hawl date",
    detail:
      "Yield has accrued into the token's price by then, so the year-end valuation already includes it. No separate rewards line to chase.",
  },
] as const;
