/**
 * The categorical palette the breakdown charts draw from — identity only, never
 * magnitude. Six hues in a fixed order, and the order is the point: it is what
 * keeps neighbouring segments apart for colour-blind readers, so slots are
 * assigned in sequence and never re-ordered or cycled.
 *
 * Validated against a white panel for protanopia and deuteranopia: worst
 * adjacent pair ΔE 16.3 simulated / 19.6 unsimulated (OKLab ×100), against
 * targets of 8 and 15. Yellow and orange are deliberately kept apart — beside
 * each other they are the pair that fails.
 *
 * Yellow and magenta sit under 3:1 against white, which is allowed only because
 * every segment is also named and valued in the legend beside the chart and in
 * the asset table below it. Never let a figure rest on the colour alone.
 */
export const SERIES_COLORS = [
  "#14976a", // brand green
  "#4a3aa7", // violet
  "#eb6834", // orange
  "#2a78d6", // blue
  "#eda100", // yellow
  "#e87ba4", // magenta
] as const;

/**
 * The tail, once there are more holdings than slots. A generated seventh hue
 * would be indistinguishable from one of the six under colour-blindness, so the
 * remainder folds into one neutral bucket instead.
 */
export const REST_COLOR = "#93a099";

/**
 * How many named segments a ring carries before the rest is folded away. Past
 * roughly six a reader stops comparing slices and starts reading the legend, at
 * which point the table below is doing the work anyway.
 */
export const MAX_SLICES = 6;

/** Colour follows the entity, so an index past the palette is the tail bucket. */
export function seriesColor(slot: number): string {
  return SERIES_COLORS[slot] ?? REST_COLOR;
}
