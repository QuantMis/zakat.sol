import type { NextRequest } from "next/server";

import { currentTotals, subscribeToTotals } from "@/lib/tally";
import type { MetricTotals } from "@/lib/types";

/**
 * The landing-page counters, pushed as they move. Every reader holds one of
 * these open and hears about a scan the moment it lands, rather than polling
 * for a figure that changes a handful of times an hour.
 *
 * Aggregates only — three numbers over the whole table, the same three the page
 * already renders. There is nothing here about any particular wallet.
 */

/** Under a proxy that buffers, an event stream arrives all at once or not at all. */
const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-store, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

/**
 * Idle connections get closed by proxies that cannot tell a quiet stream from a
 * dead one. A comment is a no-op to EventSource and enough to keep it open.
 */
const HEARTBEAT_MS = 25_000;

export async function GET(request: NextRequest): Promise<Response> {
  const encoder = new TextEncoder();

  // Read before the stream opens: a database that is down should fail as a 502
  // the browser will retry, not as a stream that connects and says nothing.
  const opening = await currentTotals();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let open = true;

      const send = (totals: MetricTotals) => {
        // The last write can land between abort and teardown, and enqueueing on
        // a closed controller throws.
        if (!open) return;

        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(totals)}\n\n`));
        } catch {
          close();
        }
      };

      const heartbeat = setInterval(() => {
        if (!open) return;

        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          close();
        }
      }, HEARTBEAT_MS);

      // Node holds the process open for a pending timer, and these live as long
      // as the reader's tab does.
      heartbeat.unref?.();

      const unsubscribe = subscribeToTotals(send);

      function close() {
        if (!open) return;
        open = false;

        clearInterval(heartbeat);
        unsubscribe();
        request.signal.removeEventListener("abort", close);

        try {
          controller.close();
        } catch {
          // Already closed from the other end, which is the usual case.
        }
      }

      request.signal.addEventListener("abort", close);

      // The opening figures, so the client has something before the first scan.
      send(opening);
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}
