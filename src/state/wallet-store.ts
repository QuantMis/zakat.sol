import {
  getPhantomProvider,
  USER_REJECTED,
  type PhantomProvider,
  type PhantomPublicKey,
} from "@/lib/phantom";

export type WalletStatus =
  /** Before the client knows whether the extension is there. */
  | "detecting"
  /** No Phantom in this browser. */
  | "unavailable"
  | "disconnected"
  | "connecting"
  | "connected";

export type WalletState = {
  status: WalletStatus;
  /** base58, set only while `status` is "connected". */
  address: string | null;
  /** A connect failure worth showing; a dismissed popup does not set one. */
  error: string | null;
};

/** Phantom injects on document load, which can land a beat after hydration. */
const INJECTION_GRACE_MS = 400;

const detecting: WalletState = { status: "detecting", address: null, error: null };
const unavailable: WalletState = { status: "unavailable", address: null, error: null };
const disconnected: WalletState = { status: "disconnected", address: null, error: null };

function connected(publicKey: PhantomPublicKey): WalletState {
  return { status: "connected", address: publicKey.toString(), error: null };
}

/**
 * Connection state lives outside React so the extension's own events — locking,
 * switching account, disconnecting from inside Phantom — land in one place
 * instead of in whichever component happened to mount the listener.
 *
 * Deliberately nothing is written to storage: a reload re-establishes the
 * session through Phantom's trusted handshake rather than a remembered address.
 */
let snapshot: WalletState = detecting;
let provider: PhantomProvider | null = null;
let started = false;

const listeners = new Set<() => void>();

function commit(next: WalletState): void {
  snapshot = next;
  for (const listener of listeners) listener();
}

function attach(found: PhantomProvider): void {
  provider = found;

  found.on("connect", (publicKey) => commit(connected(publicKey)));
  found.on("disconnect", () => commit(disconnected));
  found.on("accountChanged", (publicKey) =>
    commit(publicKey ? connected(publicKey) : disconnected),
  );

  commit(found.publicKey ? connected(found.publicKey) : disconnected);

  // Restores a session the owner already approved. Rejecting is the normal
  // first-visit path, and silent either way — this must never raise a prompt.
  void found.connect({ onlyIfTrusted: true }).catch(() => {});
}

/**
 * Runs once, on the first subscriber. A single detection pass would report
 * "unavailable" for anyone whose extension injects late, so an initial miss is
 * re-checked after the page settles before we conclude Phantom isn't there.
 */
function start(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  const found = getPhantomProvider();
  if (found) {
    attach(found);
    return;
  }

  const settle = () => {
    const late = getPhantomProvider();
    if (late) attach(late);
    else commit(unavailable);
  };

  if (document.readyState === "complete") {
    window.setTimeout(settle, INJECTION_GRACE_MS);
  } else {
    window.addEventListener("load", () => window.setTimeout(settle, INJECTION_GRACE_MS), {
      once: true,
    });
  }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  start();

  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): WalletState {
  return snapshot;
}

/** The server can't know what's installed, so it renders the detecting state. */
export function getServerSnapshot(): WalletState {
  return detecting;
}

/** A dismissed popup is a decision, not a failure — there is nothing to report. */
function describe(error: unknown): string | null {
  const { code, message } = (error ?? {}) as { code?: number; message?: string };
  if (code === USER_REJECTED) return null;

  return message ?? "Phantom could not complete the connection.";
}

/**
 * Asks Phantom for approval, resolving to the address or to `null` when the
 * request was declined, failed, or there was no extension to ask.
 */
export async function connect(): Promise<string | null> {
  if (!provider || snapshot.status === "connecting") return null;
  if (snapshot.address) return snapshot.address;

  commit({ status: "connecting", address: null, error: null });

  try {
    const { publicKey } = await provider.connect();
    const address = publicKey.toString();
    commit({ status: "connected", address, error: null });

    return address;
  } catch (error) {
    commit({ status: "disconnected", address: null, error: describe(error) });

    return null;
  }
}

/**
 * Drops the connection on our side. Phantom keeps the site trusted, so this
 * revokes the session rather than the approval — reconnecting won't re-prompt.
 */
export async function disconnect(): Promise<void> {
  if (!provider) return;

  try {
    await provider.disconnect();
  } finally {
    commit(disconnected);
  }
}
