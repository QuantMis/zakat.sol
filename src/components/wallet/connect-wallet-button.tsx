"use client";

import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useConnectWallet } from "@/components/wallet/connect-wallet-provider";

type ConnectWalletButtonProps = Pick<ComponentProps<typeof Button>, "variant" | "size" | "className"> & {
  children: ReactNode;
};

export function ConnectWalletButton({ children, ...props }: ConnectWalletButtonProps) {
  const { open } = useConnectWallet();

  return (
    <Button onClick={open} {...props}>
      {children}
    </Button>
  );
}
