"use client";

import { useState } from "react";

/**
 * Token logos come from wherever each project hosts them — IPFS gateways,
 * Arweave, GitHub, a dozen image hosts. Whitelisting that in `remotePatterns`
 * is not practical, and a wildcard would turn the image optimiser into an open
 * proxy, so these are plain lazy `<img>` tags instead.
 *
 * `no-referrer` keeps the app's URL out of the logs of every host we load a
 * logo from, which is the same courtesy the rest of the app extends.
 */
export function TokenLogo({ src, symbol }: { src?: string; symbol: string }) {
  const [failed, setFailed] = useState(false);

  // A sixth of verified mints ship no logo, and a hosted one can rot at any
  // time — either way the row keeps its shape.
  if (!src || failed) {
    return (
      <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-mint text-[10px] font-bold text-muted">
        {symbol.slice(0, 4)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see note above
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-[30px] shrink-0 rounded-full bg-mint object-cover"
    />
  );
}
