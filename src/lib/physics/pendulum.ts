import { STANDARD_GRAVITY } from './constants';

// Simple pendulum in the small-angle regime: it swings as simple harmonic
// motion, so the period depends only on the length and gravity - never on the
// mass of the bob or (for small swings) on how far it is pulled.

/**
 * Period T (s) of a simple pendulum: T = 2*pi*sqrt(L/g).
 * `lengthM` is the rod length in metres; `g` defaults to Earth's standard
 * gravity. Throws RangeError unless lengthM > 0.
 */
export function period(lengthM: number, g: number = STANDARD_GRAVITY): number {
  if (!(lengthM > 0)) {
    throw new RangeError(`lengthM must be positive, got ${lengthM}`);
  }
  return 2 * Math.PI * Math.sqrt(lengthM / g);
}

/**
 * Angular displacement (rad) at time `tSeconds` for small-angle SHM:
 * angle = amplitude * cos(2*pi*t / T), where T is the period for `lengthM`.
 * Used to drive the swing animation.
 */
export function angleAt(
  amplitudeRad: number,
  lengthM: number,
  tSeconds: number,
  g: number = STANDARD_GRAVITY,
): number {
  const T = period(lengthM, g);
  return amplitudeRad * Math.cos((2 * Math.PI * tSeconds) / T);
}
