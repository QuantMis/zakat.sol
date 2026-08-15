"use client";

import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useConnectWallet } from "@/components/wallet/connect-wallet-provider";
import { shortenAddress } from "@/lib/format";
import { useWallet } from "@/state/use-wallet";

type ConnectWalletButtonProps = Pick<ComponentProps<typeof Button>, "variant" | "size" | "className"> & {
  children: ReactNode;
};

/** `children` is the call to action; a connected wallet shows its address instead. */
export function ConnectWalletButton({ children, ...props }: ConnectWalletButtonProps) {
  const { open } = useConnectWallet();
  const { address } = useWallet();

  return (
    <Button onClick={open} {...props}>
      {address ? <span>{shortenAddress(address)}</span> : children}
    </Button>
  );
}
