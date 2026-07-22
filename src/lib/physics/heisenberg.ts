import { REDUCED_PLANCK } from './constants';

// Heisenberg uncertainty for position and momentum. Δx and Δp are the standard
// deviations (statistical spreads) of a quantum state's position and momentum;
// their product cannot drop below ħ/2. A minimum-uncertainty (Gaussian)
// wavepacket saturates the bound, so Δx·Δp = ħ/2 exactly.

/**
 * The saturated momentum spread Δp = ħ / (2·Δx) for a minimum-uncertainty
 * Gaussian wavepacket of position spread `positionSpread` (Δx). This is the
 * smallest momentum spread allowed at that position spread. Units follow the
 * input: pass Δx in metres to get Δp in kg·m/s.
 */
export function minMomentumSpread(positionSpread: number): number {
  if (!(positionSpread > 0)) {
    throw new RangeError(`position spread must be positive, got Δx=${positionSpread}`);
  }
  return REDUCED_PLANCK / (2 * positionSpread);
}

/** The uncertainty product Δx·Δp, for checking against the bound ħ/2. */
export function uncertaintyProduct(positionSpread: number, momentumSpread: number): number {
  return positionSpread * momentumSpread;
}
