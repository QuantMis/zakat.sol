import type { CalendarSystem, NisabBasis } from "@/lib/types";

/**
 * The positions the calculator takes. These were once preferences with a screen
 * behind them; the screen is gone, so they are stated here in one place rather
 * than scattered through the components that read them.
 *
 * Because nothing is adjustable, nothing is stored — the app writes no
 * localStorage at all.
 */

/** Gold 85g: the more common contemporary position. */
export const NISAB_BASIS: NisabBasis = "gold";

/**
 * Which calendar the years are *written* in. The years themselves are lunar
 * either way — a hawl is a lunar year — so this only changes how each one is
 * named on screen, never what it covers or when it fell due.
 */
export const CALENDAR: CalendarSystem = "gregorian";

/** Whether the zakat figure is also quoted in SOL. */
export const SHOW_SOL_EQUIVALENT = true;
