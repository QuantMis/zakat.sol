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

  // A wallet paying itself moves nothing: the treasury's balance comes back
  // lower by the fee, so the transfer is refused after it has been made and
  // paid for. Refusing to build it costs nobody a fee. Usually this is a
  // treasury pointed at the wallet doing the testing.
  if (payer === TREASURY_ADDRESS) {
    return Response.json(
      { error: "This wallet is the treasury, so it cannot pay itself." },
      { status: 400 },
    );
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

    // The whole transaction, base58, with the signature slot left empty for
    // Phantom to fill. Its older docs show the bare message here, but current
    // builds read this as a transaction — handed a message, they take the
    // header's signer count for a signature count and run off the end of the
    // buffer. Serialising it here keeps the browser free of a Solana library,
    // and what crosses is bytes it cannot alter without invalidating them.
    return Response.json(
      {
        transaction: bs58.encode(
          transaction.serialize({ requireAllSignatures: false, verifySignatures: false }),
        ),
        lamports: PRICE_LAMPORTS,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("GET /api/premium/intent", error);

    return Response.json({ error: "Could not prepare that payment." }, { status: 502 });
  }
}
