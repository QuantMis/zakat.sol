import { createHash } from "node:crypto";

import { prisma } from "@/lib/prisma";
import type { MetricTotals, PortfolioSnapshot } from "@/lib/types";
import { round2 } from "@/lib/zakat";

/**
 * The landing-page counters, and the only thing this app remembers about a
 * scan. One row per address in `WalletTally`, upserted rather than appended, so
 * the three figures are a standing count of the wallets that owed zakat, what
 * they owed, and the coins they held — not a log of who looked at what.
 *
 * The address is hashed on the way in and never stored, so a row can be updated
 * when the same wallet is scanned again without the table knowing whose it is.
 */

const ZERO: MetricTotals = { wallets: 0, zakatUsd: 0, coins: 0 };

/** How long a read is reused before the table is asked again. */
const FRESH_MS = 5_000;

/**
 * A safety net, not the mechanism: writes push straight to subscribers, and
 * this only catches rows a second server instance wrote.
 */
const SWEEP_MS = 30_000;

let salt: string | null | undefined;

/**
 * Without a salt the hash is worthless — Solana addresses are public, so anyone
 * with the table could hash a list of known wallets and match them. Recording
 * is skipped rather than done badly, and rather than failing the scan the
 * caller was actually asking for.
 */
function hashSalt(): string | null {
  if (salt === undefined) {
    salt = process.env.METRICS_HASH_SALT || null;

    if (!salt) {
      console.warn("METRICS_HASH_SALT is not set — scans will not be counted.");
    }
  }

  return salt;
}

function hashAddress(address: string, withSalt: string): string {
  return createHash("sha256").update(`${withSalt}:${address}`).digest("hex");
}

type TotalsRow = { wallets: number; zakatUsd: number; coins: number };

/**
 * All three figures in one round trip. `wallets` and `coins` count every scan,
 * because a wallet the calculator read is a wallet it read whether or not the
 * answer was "nothing is due" — most are under the nisab, and a band that only
 * counted the ones above it would sit at zero for weeks at a time.
 *
 * `zakatUsd` is filtered to the wallets that owed something. The filter changes
 * no arithmetic — the rest contribute 0 — but it says which rows the figure is
 * about, so the sum cannot quietly acquire meaning from wallets that owed
 * nothing if the column ever holds anything other than a settled amount.
 *
 * `coins` cannot be a sum of per-wallet counts — the same mint held by two
 * wallets is one coin — so it unnests the arrays and counts the distinct mints
 * across the whole table.
 */
async function readTotals(): Promise<MetricTotals> {
  const [row] = await prisma.$queryRaw<TotalsRow[]>`
    SELECT
      COUNT(*)::int AS "wallets",
      COALESCE(SUM("zakatDueUsd") FILTER (WHERE "zakatDueUsd" > 0), 0)::float8 AS "zakatUsd",
      COALESCE(
        (SELECT COUNT(DISTINCT mint) FROM "WalletTally", UNNEST("mints") AS mint),
        0
      )::int AS "coins"
    FROM "WalletTally"
  `;

  return row ?? ZERO;
}

let cached: MetricTotals = ZERO;
let readAt = 0;
let inFlight: Promise<MetricTotals> | null = null;

const listeners = new Set<(totals: MetricTotals) => void>();
let sweep: ReturnType<typeof setInterval> | null = null;

function changed(next: MetricTotals): boolean {
  return (
    next.wallets !== cached.wallets ||
    next.zakatUsd !== cached.zakatUsd ||
    next.coins !== cached.coins
  );
}

/**
 * Reads the table and hands the result to anyone listening, but only when a
 * figure actually moved — a scan that changes nothing should not wake every
 * open tab. Concurrent callers share one query.
 */
async function refresh(): Promise<MetricTotals> {
  inFlight ??= readTotals()
    .then((totals) => {
      const moved = changed(totals);

      cached = totals;
      readAt = Date.now();

      if (moved) for (const listener of listeners) listener(totals);

      return totals;
    })
    .catch((error: unknown) => {
      // The counters are decoration on a page that works without them, so a
      // database that is down shows the last figures rather than an error.
      console.error("Could not read the wallet tally", error);

      return cached;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** The figures as they stand, re-reading only once they have gone stale. */
export async function currentTotals(): Promise<MetricTotals> {
  if (readAt && Date.now() - readAt < FRESH_MS) return cached;

  return refresh();
}

/**
 * Pushes every change to `listener` until the returned function is called. The
 * sweep runs only while somebody is listening — with no open streams there is
 * nobody to tell, and the next page load reads the table anyway.
 */
export function subscribeToTotals(listener: (totals: MetricTotals) => void): () => void {
  listeners.add(listener);

  sweep ??= setInterval(() => void refresh(), SWEEP_MS);
  // Node keeps the process alive for a pending timer; a metrics poll should not
  // be the reason a container refuses to shut down.
  sweep.unref?.();

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && sweep) {
      clearInterval(sweep);
      sweep = null;
    }
  };
}

/**
 * Folds a finished scan into the counters. Called for effect and never awaited
 * by the scan itself: a wallet is reported on whether or not it was counted.
 */
export async function recordScan(
  snapshot: PortfolioSnapshot,
  totals: { holdingsUsd: number; zakatDueUsd: number },
): Promise<void> {
  const withSalt = hashSalt();
  if (!withSalt) return;

  // Priced holdings only. The dust bucket is mints nothing could value, and
  // counting unpriced junk airdrops as coins the calculator covers would be a
  // lie in the direction that flatters us.
  const mints = [...new Set(snapshot.assets.map((asset) => asset.mint))];

  const walletHash = hashAddress(snapshot.address, withSalt);
  const row = {
    mints,
    holdingsUsd: round2(totals.holdingsUsd),
    zakatDueUsd: round2(totals.zakatDueUsd),
  };

  try {
    await prisma.walletTally.upsert({
      where: { walletHash },
      create: { walletHash, ...row },
      update: row,
    });
  } catch (error) {
    // Two tabs scanning one wallet can collide on the insert. The other writer
    // stored the same figures, so there is nothing to retry.
    console.error("Could not record the wallet tally", error);

    return;
  }

  await refresh();
}
