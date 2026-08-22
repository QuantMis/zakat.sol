import type { NextRequest } from "next/server";

import { isUnlocked, redeem } from "@/lib/premium";

/**
 * Whether an address's earlier years are open, and the way to open them.
 *
 * Payment buys the wallet's history rather than a seat, so there is nobody to
 * authenticate: whoever looks the address up afterwards sees what was paid for.
 */

/** Base58 alphabet — no 0, O, I or l. A pubkey is 32 bytes, so 32–44 chars. */
const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/** Base58 too, and a signature is 64 bytes rather than 32. */
const BASE58_SIGNATURE = /^[1-9A-HJ-NP-Za-km-z]{64,90}$/;

export async function GET(request: NextRequest): Promise<Response> {
  const address = request.nextUrl.searchParams.get("address");

  if (!address || !BASE58_ADDRESS.test(address)) {
    return Response.json({ error: "A base58 Solana address is required." }, { status: 400 });
  }

  try {
    return Response.json(
      { unlocked: await isUnlocked(address) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    // Almost always the database being unreachable, which names the host.
    console.error("GET /api/premium", error);

    return Response.json({ error: "Could not check that address." }, { status: 502 });
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  let body: { address?: string; signature?: string };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const { address, signature } = body;

  if (!address || !BASE58_ADDRESS.test(address)) {
    return Response.json({ error: "A base58 Solana address is required." }, { status: 400 });
  }

  if (!signature || !BASE58_SIGNATURE.test(signature)) {
    return Response.json({ error: "A base58 transaction signature is required." }, { status: 400 });
  }

  try {
    const result = await redeem(address, signature);

    // Not settled yet is not the same as not valid: the signature is real and
    // the caller should ask again shortly rather than be told the payment
    // failed. 402 is reserved for a payment the chain has actually judged.
    if (!result.ok) {
      return Response.json({ error: result.reason }, { status: result.pending ? 425 : 402 });
    }

    return Response.json({ unlocked: true });
  } catch (error) {
    console.error("POST /api/premium", error);

    return Response.json({ error: "Could not confirm that payment." }, { status: 502 });
  }
}
