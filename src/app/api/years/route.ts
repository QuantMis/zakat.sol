import type { NextRequest } from "next/server";

import { isUnlocked } from "@/lib/premium";
import { lockedYears, reconstructYears } from "@/lib/reconstruct";

/**
 * Past zakat years for an address, rebuilt from the chain. Keeps both keys on
 * the server — the archive is asked whose wallet it is, and the price archive
 * is asked only about mints and dates, which is the same split the live scan
 * makes.
 *
 * A rebuild reads a balance per holding per year, so it is slow the first time
 * and cached after that.
 */

/** Base58 alphabet — no 0, O, I or l. A pubkey is 32 bytes, so 32–44 chars. */
const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function GET(request: NextRequest): Promise<Response> {
  const address = request.nextUrl.searchParams.get("address");

  if (!address || !BASE58_ADDRESS.test(address)) {
    return Response.json({ error: "A base58 Solana address is required." }, { status: 400 });
  }

  // Fails closed: if the record of who has paid cannot be read, nothing is
  // opened. A locked answer is wrong-but-harmless; an open one is neither.
  const paid = await isUnlocked(address).catch((error: unknown) => {
    console.error("GET /api/years (unlock check)", error);

    return false;
  });

  if (!paid) {
    return Response.json(
      { years: lockedYears() },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const years = await reconstructYears(address);

    return Response.json({ years }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // Can name the upstream provider or a missing key, so it is logged instead.
    console.error("GET /api/years", error);

    return Response.json({ error: "Could not rebuild that history right now." }, { status: 502 });
  }
}
