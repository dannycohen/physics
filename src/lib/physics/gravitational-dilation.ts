/**
 * Rate of a clock at radial coordinate r relative to a far-away clock, in the
 * Schwarzschild geometry: rate = sqrt(1 - r_s/r) = sqrt(1 - 1/rOverRs), where
 * rOverRs = r / r_s and r_s is the Schwarzschild (event-horizon) radius.
 *
 * Throws RangeError unless rOverRs > 1: at the horizon (rOverRs = 1) the rate
 * is zero and at/inside it (rOverRs <= 1) proper time is frozen or undefined.
 */
export function clockRate(rOverRs: number): number {
  if (!(rOverRs > 1)) {
    throw new RangeError(`rOverRs must satisfy rOverRs > 1, got ${rOverRs}`);
  }
  return Math.sqrt(1 - 1 / rOverRs);
}
