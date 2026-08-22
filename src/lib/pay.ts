"use client";

import { getPhantomProvider, USER_REJECTED } from "@/lib/phantom";

/**
 * Paying to open an address: ask the server for the transaction, have Phantom
 * sign and broadcast it, then hand the signature back to be checked against the
 * chain. Nothing is unlocked on the client's say-so — this only reports what
 * the server concluded.
 */

/** How long to keep asking the chain about a signature it has only just seen. */
const SETTLE_ATTEMPTS = 8;
const SETTLE_DELAY_MS = 1500;

/** The server says a payment is real but not settled yet with this status. */
const NOT_SETTLED = 425;

export type PaymentResult =
  | { status: "unlocked" }
  /** The popup was dismissed. A decision, not a failure, so nothing is shown. */
  | { status: "declined" }
  | { status: "failed"; error: string };

function messageOf(error: unknown, fallback: string): string {
  const { message } = (error ?? {}) as { message?: string };

  return message ?? fallback;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function errorFrom(response: Response, fallback: string): Promise<string> {
  try {
    const { error } = (await response.json()) as { error?: string };

    return error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function payToOpen(address: string, payer: string): Promise<PaymentResult> {
  const provider = getPhantomProvider();
  if (!provider) return { status: "failed", error: "Phantom is not available in this browser." };

  const intent = await fetch(
    `/api/premium/intent?address=${encodeURIComponent(address)}&payer=${encodeURIComponent(payer)}`,
  );

  if (!intent.ok) {
    return { status: "failed", error: await errorFrom(intent, "Could not prepare that payment.") };
  }

  const { transaction } = (await intent.json()) as { transaction: string };

  let signature: string;
  try {
    ({ signature } = await provider.request({
      method: "signAndSendTransaction",
      // Phantom's parameter is called `message`; what it takes is the whole
      // serialized transaction. See the note on the provider type.
      params: { message: transaction },
    }));
  } catch (error) {
    const { code } = (error ?? {}) as { code?: number };
    if (code === USER_REJECTED) return { status: "declined" };

    return { status: "failed", error: messageOf(error, "Phantom could not send that payment.") };
  }

  // Sent, but worth nothing until the chain is asked about it — and the chain
  // takes a few seconds to answer about a signature it has only just seen.
  // That gap comes back as `NOT_SETTLED` and is waited out rather than reported
  // as a failure: money has left the wallet by this point, so giving up on the
  // first no would leave someone paid up and locked out. Any other refusal is
  // a real answer and is shown straight away.
  let error = "That payment could not be confirmed yet.";

  for (let attempt = 0; attempt < SETTLE_ATTEMPTS; attempt += 1) {
    const confirmed = await fetch("/api/premium", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, signature }),
    });

    if (confirmed.ok) return { status: "unlocked" };

    error = await errorFrom(confirmed, error);
    if (confirmed.status !== NOT_SETTLED) break;

    await wait(SETTLE_DELAY_MS);
  }

  return { status: "failed", error };
}
