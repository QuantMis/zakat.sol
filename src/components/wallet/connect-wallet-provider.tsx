"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { ConnectWalletModal } from "@/components/wallet/connect-wallet-modal";
import { useWallet } from "@/state/use-wallet";

type ConnectWalletValue = {
  open: () => void;
  close: () => void;
};

const ConnectWalletContext = createContext<ConnectWalletValue | null>(null);

export function ConnectWalletProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useWallet();
  const router = useRouter();

  /**
   * There is nothing to ask an already-connected wallet, so the prompt is
   * skipped and the report it would have led to is opened instead.
   */
  const open = useCallback(() => {
    if (address) {
      router.push("/calculation");

      return;
    }

    setIsOpen(true);
  }, [address, router]);

  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ConnectWalletContext.Provider value={value}>
      {children}
      {isOpen ? <ConnectWalletModal onClose={close} /> : null}
    </ConnectWalletContext.Provider>
  );
}

export function useConnectWallet(): ConnectWalletValue {
  const context = useContext(ConnectWalletContext);

  if (!context) {
    throw new Error("useConnectWallet must be used inside <ConnectWalletProvider>");
  }

  return context;
}
