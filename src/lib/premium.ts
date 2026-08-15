import { PREMIUM_PRICE_SOL, TREASURY_ADDRESS } from "@/data/premium";
import { fetchTransaction } from "@/lib/helius";
import { prisma } from "@/lib/prisma";

/**
 * Turns a transfer on the chain into an opened address.
 *
 * Nothing is taken on the client's word. The signature it hands back is looked
 * up on the chain and has to satisfy all of:
 *
 *  - it succeeded, and is confirmed;
 *  - the treasury's balance went up by at least the price;
 *  - it carries a memo naming the address being opened, so a payment cannot be
 *    lifted from the chain and spent on a different wallet's history;
 *  - it has not been redeemed before.
 *
 * The last two are what stop a bystander watching the treasury, taking someone
 * else's signature, and opening an address with it.
 */

const LAMPORTS_PER_SOL = 1_000_000_000;

export const PRICE_LAMPORTS = Math.round(PREMIUM_PRICE_SOL * LAMPORTS_PER_SOL);

/** Memo carried by the payment, binding it to the address it opens. */
export function memoFor(address: string): string {
  return `zakat:open:${address}`;
}

export type RedeemResult =
  | { ok: true }
  | { ok: false; reason: string };

export async function isUnlocked(address: string): Promise<boolean> {
  const paid = await prisma.premiumUnlock.findFirst({ where: { address } });

  return paid !== null;
}

/**
 * Verifies a payment and opens the address it names. Safe to call twice with
 * the same signature: the second call finds it spent and says so rather than
 * granting again.
 */
export async function redeem(address: string, signature: string): Promise<RedeemResult> {
  if (!TREASURY_ADDRESS) return { ok: false, reason: "No treasury address is configured." };

  const spent = await prisma.premiumUnlock.findUnique({ where: { signature } });
  if (spent) {
    return spent.address === address
      ? { ok: true }
      : { ok: false, reason: "That payment has already been used." };
  }

  const transaction = await fetchTransaction(signature);
  if (!transaction) return { ok: false, reason: "That payment could not be found on-chain yet." };
  if (transaction.failed) return { ok: false, reason: "That payment did not succeed." };

  if (!transaction.memos.includes(memoFor(address))) {
    return { ok: false, reason: "That payment was not made for this address." };
  }

  const received = transaction.creditedTo(TREASURY_ADDRESS);
  if (received < PRICE_LAMPORTS) {
    return { ok: false, reason: "That payment was for less than the price." };
  }

  // Unique on `signature`, so two tabs redeeming at once cannot both grant.
  try {
    await prisma.premiumUnlock.create({
      data: {
        address,
        signature,
        payer: transaction.payer,
        lamports: BigInt(received),
      },
    });
  } catch {
    // Lost the race; the other writer granted the same thing.
    const now = await prisma.premiumUnlock.findUnique({ where: { signature } });
    if (!now || now.address !== address) return { ok: false, reason: "That payment is spent." };
  }

  return { ok: true };
}
