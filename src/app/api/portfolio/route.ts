import type { NextRequest } from "next/server";

import { scanPortfolio } from "@/lib/scan";

/**
 * Keeps the Helius key on the server, and nothing else. The address arrives in
 * the query string, is scanned, and the answer goes straight back out — nothing
 * about the request is written down.
 */

/** Base58 alphabet — no 0, O, I or l. A pubkey is 32 bytes, so 32–44 chars. */
const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function GET(request: NextRequest): Promise<Response> {
  const address = request.nextUrl.searchParams.get("address");

  if (!address || !BASE58_ADDRESS.test(address)) {
    return Response.json({ error: "A base58 Solana address is required." }, { status: 400 });
  }

  try {
    const snapshot = await scanPortfolio(address);

    // Whose wallet holds what is nobody's business to keep, least of all a
    // CDN's between here and the reader.
    return Response.json(snapshot, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // The message can name the upstream provider or the missing key, so it is
    // logged rather than returned.
    console.error("GET /api/portfolio", error);

    return Response.json({ error: "Could not read that address right now." }, { status: 502 });
  }
}
