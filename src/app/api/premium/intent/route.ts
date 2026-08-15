import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import bs58 from "bs58";
import type { NextRequest } from "next/server";

import { TREASURY_ADDRESS } from "@/data/premium";
import { latestBlockhash } from "@/lib/helius";
import { PRICE_LAMPORTS, memoFor } from "@/lib/premium";

/**
 * Builds the payment for the browser to sign, rather than letting the browser
 * build it: the amount and the recipient are then this side's to decide, and
 * the wallet prompt shows what the page promised.
 *
 * The memo binds the transfer to the address it opens, which is what makes a
 * payment unusable against anyone else's history.
 */

/** Notes arbitrary text onto a transaction. No accounts, no authority. */
const MEMO_PROGRAM = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

/** Base58 alphabet — no 0, O, I or l. A pubkey is 32 bytes, so 32–44 chars. */
const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function GET(request: NextRequest): Promise<Response> {
  const address = request.nextUrl.searchParams.get("address");
  const payer = request.nextUrl.searchParams.get("payer");

  if (!address || !BASE58_ADDRESS.test(address) || !payer || !BASE58_ADDRESS.test(payer)) {
    return Response.json({ error: "An address and a payer are required." }, { status: 400 });
  }

  if (!TREASURY_ADDRESS) {
    return Response.json({ error: "Payments are not configured." }, { status: 503 });
  }

  try {
    const from = new PublicKey(payer);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: new PublicKey(TREASURY_ADDRESS),
        lamports: PRICE_LAMPORTS,
      }),
      new TransactionInstruction({
        keys: [],
        programId: MEMO_PROGRAM,
        data: Buffer.from(memoFor(address), "utf8"),
      }),
    );

    transaction.feePayer = from;
    transaction.recentBlockhash = await latestBlockhash();

    // Handed over as the base58 message Phantom's `request` takes, so the
    // browser never needs a Solana library — and so the only thing that crosses
    // is bytes it cannot alter without invalidating what it signs.
    return Response.json(
      { message: bs58.encode(transaction.serializeMessage()), lamports: PRICE_LAMPORTS },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("GET /api/premium/intent", error);

    return Response.json({ error: "Could not prepare that payment." }, { status: 502 });
  }
}
