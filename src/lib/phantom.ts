/**
 * Phantom injects a provider into the page rather than shipping an SDK, so this
 * is a hand-written view of the surface we use: connect, disconnect, the events
 * the extension fires when it changes state on its own, and the one transaction
 * the app ever builds — paying to open earlier years.
 *
 * Reading a wallet never touches any of the signing surface. A report is the
 * same whether the address was connected or pasted, and pasting cannot pay.
 */

/** Only ever read as base58 — we never touch key material. */
export type PhantomPublicKey = { toString(): string };

export type PhantomProvider = {
  isPhantom?: boolean;
  publicKey: PhantomPublicKey | null;
  /** `onlyIfTrusted` reconnects an already-approved site without prompting. */
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PhantomPublicKey }>;
  disconnect(): Promise<void>;
  /**
   * Signs and broadcasts a transaction the server built. The parameter is named
   * `message` for historical reasons; what Phantom deserializes is the whole
   * base58 transaction, unsigned. Phantom broadcasts through its own node, so
   * the page needs neither an RPC URL nor a Solana library of its own.
   */
  request(args: {
    method: "signAndSendTransaction";
    params: { message: string };
  }): Promise<{ signature: string }>;
  on(event: "connect", handler: (publicKey: PhantomPublicKey) => void): void;
  on(event: "disconnect", handler: () => void): void;
  /** Fires with `null` when the extension locks or the account is removed. */
  on(event: "accountChanged", handler: (publicKey: PhantomPublicKey | null) => void): void;
};

type PhantomWindow = Window & {
  phantom?: { solana?: PhantomProvider };
  /** Pre-`window.phantom` injection, still present in older builds. */
  solana?: PhantomProvider;
};

/** The provider if this browser has Phantom, `null` while it doesn't (yet). */
export function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;

  const injected = window as PhantomWindow;
  const provider = injected.phantom?.solana ?? injected.solana;

  return provider?.isPhantom ? provider : null;
}

/** Phantom rejects with this code when someone dismisses the approval popup. */
export const USER_REJECTED = 4001;
