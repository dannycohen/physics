import { PLANCK_CONSTANT, BOLTZMANN, C, WIEN_WAVELENGTH_B } from './constants';

// Planck's law for blackbody radiation, expressed per unit WAVELENGTH. A body
// in thermal equilibrium at temperature T emits a smooth spectrum whose shape
// is fixed by T alone: the lambda^5 term forces the radiance to zero at short
// wavelengths (no ultraviolet catastrophe), while the exponential denominator
// caps the long-wavelength tail. The peak sits at Wien's displacement wavelength.

function assertPositive(lambdaMeters: number, tempK: number): void {
  if (!(lambdaMeters > 0) || !(tempK > 0)) {
    throw new RangeError(
      `wavelength and temperature must be positive, got lambda=${lambdaMeters}, T=${tempK}`,
    );
  }
}

/**
 * Spectral radiance B_lambda of a blackbody at temperature `tempK`, per unit
 * wavelength `lambdaMeters` (metres). Units: W*sr^-1*m^-2 per metre of
 * wavelength. Throws RangeError on non-positive inputs; the radiance tends to 0
 * as lambda -> 0, so extremely short wavelengths return 0 rather than overflow.
 */
export function spectralRadiance(lambdaMeters: number, tempK: number): number {
  assertPositive(lambdaMeters, tempK);
  const exponent = (PLANCK_CONSTANT * C) / (lambdaMeters * BOLTZMANN * tempK);
  // As lambda -> 0 the exponent diverges and B_lambda -> 0. Guard the exp()
  // overflow so the short-wavelength limit reads 0 instead of NaN/Infinity.
  if (!Number.isFinite(Math.exp(exponent))) return 0;
  const prefactor = (2 * PLANCK_CONSTANT * C * C) / Math.pow(lambdaMeters, 5);
  return prefactor / (Math.exp(exponent) - 1);
}

/** Wavelength of peak spectral radiance, in metres (Wien's displacement law,
 *  b / T). Halves when the temperature doubles: hotter bodies glow bluer. */
export function peakWavelength(tempK: number): number {
  if (!(tempK > 0)) {
    throw new RangeError(`temperature must be positive, got T=${tempK}`);
  }
  return WIEN_WAVELENGTH_B / tempK;
}
