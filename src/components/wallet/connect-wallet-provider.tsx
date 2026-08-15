"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { ConnectWalletModal } from "@/components/wallet/connect-wallet-modal";

type ConnectWalletValue = {
  open: () => void;
  close: () => void;
};

const ConnectWalletContext = createContext<ConnectWalletValue | null>(null);

export function ConnectWalletProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
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
