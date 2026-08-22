import { after, type NextRequest } from "next/server";

import { metalPrices } from "@/data/nisab";
import { NISAB_BASIS } from "@/data/settings";
import { solPriceOf } from "@/lib/portfolio";
import { scanPortfolio } from "@/lib/scan";
import { recordScan } from "@/lib/tally";
import { calculateZakat, nisabThreshold } from "@/lib/zakat";

/**
 * Keeps the Helius key on the server, and nothing else. The address arrives in
 * the query string, is scanned, and the answer goes straight back out.
 *
 * The scan then adds itself to the landing-page counters, under a salted hash
 * of the address — see src/lib/tally.ts for what that keeps and what it does
 * not. It runs after the response, so counting never delays a scan.
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

    after(async () => {
      // Worked out here rather than read back off the client, using the same
      // functions the dashboard renders from, so the counter cannot be moved by
      // anything but a real scan.
      const zakat = calculateZakat({
        assets: snapshot.assets,
        dust: snapshot.dust,
        nisab: nisabThreshold(NISAB_BASIS, metalPrices),
        solPrice: solPriceOf(snapshot),
      });

      await recordScan(snapshot, {
        holdingsUsd: zakat.netZakatable,
        zakatDueUsd: zakat.zakatDue,
      });
    });

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
