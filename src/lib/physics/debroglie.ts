// de Broglie matter wave: every particle with momentum p = m*v has a wavelength
// lambda = h / p. Faster and heavier particles have shorter wavelengths, which is
// why the wave nature of everyday objects is unobservable while an electron's is
// about the size of an atom.

import { PLANCK_CONSTANT } from './constants';

/**
 * de Broglie wavelength lambda = h / (m*v), in metres.
 * Throws RangeError unless massKg > 0 and speedMs > 0.
 */
export function deBroglieWavelength(massKg: number, speedMs: number): number {
  if (!(massKg > 0)) {
    throw new RangeError(`massKg must be positive, got ${massKg}`);
  }
  if (!(speedMs > 0)) {
    throw new RangeError(`speedMs must be positive, got ${speedMs}`);
  }
  return PLANCK_CONSTANT / (massKg * speedMs);
}
