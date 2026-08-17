/**
 * Proper-time rate of a stationary observer held at fixed radial coordinate r
 * relative to a stationary observer at infinity, outside a nonrotating,
 * spherically symmetric mass: rate = sqrt(1 - r_s/r) = sqrt(1 - 1/rOverRs).
 * Here rOverRs = r / r_s. The Schwarzschild radius r_s is an event horizon only
 * when the mass lies within it; for a larger body it is only a derived scale.
 *
 * Throws RangeError unless rOverRs > 1. The stationary lapse formally tends to
 * zero as r approaches r_s from outside, but no physical observer can hover at
 * a black-hole horizon. This function does not describe an infalling observer,
 * whose proper time remains regular at the horizon.
 */
export function clockRate(rOverRs: number): number {
  if (!(rOverRs > 1)) {
    throw new RangeError(`rOverRs must satisfy rOverRs > 1, got ${rOverRs}`);
  }
  return Math.sqrt(1 - 1 / rOverRs);
}
