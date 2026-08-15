"use client";

import { getPhantomProvider, USER_REJECTED } from "@/lib/phantom";

/**
 * Paying to open an address: ask the server for the transaction, have Phantom
 * sign and broadcast it, then hand the signature back to be checked against the
 * chain. Nothing is unlocked on the client's say-so — this only reports what
 * the server concluded.
 */

export type PaymentResult =
  | { status: "unlocked" }
  /** The popup was dismissed. A decision, not a failure, so nothing is shown. */
  | { status: "declined" }
  | { status: "failed"; error: string };

function messageOf(error: unknown, fallback: string): string {
  const { message } = (error ?? {}) as { message?: string };

  return message ?? fallback;
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

  const { message } = (await intent.json()) as { message: string };

  let signature: string;
  try {
    ({ signature } = await provider.request({
      method: "signAndSendTransaction",
      params: { message },
    }));
  } catch (error) {
    const { code } = (error ?? {}) as { code?: number };
    if (code === USER_REJECTED) return { status: "declined" };

    return { status: "failed", error: messageOf(error, "Phantom could not send that payment.") };
  }

  // Sent, but worth nothing until the chain is asked about it. A failure here
  // loses no money — the signature can be redeemed again once it settles.
  const confirmed = await fetch("/api/premium", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature }),
  });

  if (!confirmed.ok) {
    return {
      status: "failed",
      error: await errorFrom(confirmed, "That payment could not be confirmed yet."),
    };
  }

  return { status: "unlocked" };
}
