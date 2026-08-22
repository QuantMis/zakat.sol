/**
 * A dashboard link that keeps reporting on the address being watched, so moving
 * between screens does not drop a pasted wallet back to whatever Phantom has
 * connected — nothing, for a visitor who never connected one.
 *
 * A connected wallet's address is deliberately not appended: the dashboard
 * already follows Phantom, and pinning that address to the URL would outlive a
 * switch of account.
 */
export function watchedHref(href: string, address: string | null): string {
  return address ? `${href}?address=${encodeURIComponent(address)}` : href;
}
