"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { setTarget } from "@/state/portfolio-store";
import { useWallet } from "@/state/use-wallet";

/**
 * Decides which address the dashboard reports on. One in the URL wins, so a
 * pasted or shared link keeps showing that wallet even while another is
 * connected; otherwise it follows Phantom.
 *
 * Renders nothing — it exists so that decision lives in one place instead of in
 * whichever screen happened to mount first.
 */
export function ScanSync() {
  const params = useSearchParams();
  const { address } = useWallet();
  const requested = params.get("address");

  useEffect(() => {
    setTarget(requested ?? address);
  }, [requested, address]);

  return null;
}
