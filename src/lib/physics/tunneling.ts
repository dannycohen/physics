// Quantum tunnelling through a one-dimensional rectangular potential barrier.
//
// Model: the EXACT transmission coefficient for a particle of energy E striking
// a rectangular barrier of height V0 and width a, in the tunnelling regime
// E < V0. Solving the time-independent Schrodinger equation and matching the
// wavefunction and its derivative at both barrier walls gives
//
//   T = 1 / (1 + V0^2 * sinh^2(kappa * a) / (4 * E * (V0 - E)))
//
// with decay constant  kappa = sqrt(2 m (V0 - E)) / hbar. This is exact (no WKB
// approximation) for the idealised rectangular barrier. Inside the barrier the
// wavefunction decays like exp(-kappa x); a small amplitude survives on the far
// side, so T > 0 even though the particle classically cannot get over the top.
//
// Energies are taken in electronvolts and the width in nanometres; both are
// converted to SI to form kappa. In the ratio V0^2 / (4 E (V0 - E)) the energy
// units cancel, so that term is computed directly in eV.

import { REDUCED_PLANCK, ELECTRON_MASS, ELEMENTARY_CHARGE } from './constants';

/**
 * Transmission probability T through a rectangular barrier in the tunnelling
 * regime, where the particle energy is below the barrier top (0 < E < V0).
 *
 * @param energyEv         particle energy E, in electronvolts
 * @param barrierHeightEv  barrier height V0, in electronvolts
 * @param barrierWidthNm   barrier width a, in nanometres
 * @param massKg           particle mass in kg (defaults to the electron mass)
 * @returns T, clamped to [0, 1]
 * @throws RangeError unless 0 < E < V0 and the width and mass are positive.
 */
export function transmission(
  energyEv: number,
  barrierHeightEv: number,
  barrierWidthNm: number,
  massKg: number = ELECTRON_MASS,
): number {
  if (!(energyEv > 0)) {
    throw new RangeError(`energyEv must be positive, got ${energyEv}`);
  }
  if (!(barrierHeightEv > 0)) {
    throw new RangeError(`barrierHeightEv must be positive, got ${barrierHeightEv}`);
  }
  if (!(barrierWidthNm > 0)) {
    throw new RangeError(`barrierWidthNm must be positive, got ${barrierWidthNm}`);
  }
  if (!(massKg > 0)) {
    throw new RangeError(`massKg must be positive, got ${massKg}`);
  }
  // The tunnelling formula only applies below the barrier top.
  if (!(energyEv < barrierHeightEv)) {
    throw new RangeError(
      `energyEv (${energyEv}) must be less than barrierHeightEv (${barrierHeightEv}) for the tunnelling regime`,
    );
  }

  const V0 = barrierHeightEv;
  const E = energyEv;
  const a = barrierWidthNm * 1e-9; // nm -> m
  const barrierJoules = (V0 - E) * ELEMENTARY_CHARGE; // eV -> J

  const kappa = Math.sqrt(2 * massKg * barrierJoules) / REDUCED_PLANCK;
  const sinhTerm = Math.sinh(kappa * a);
  const T = 1 / (1 + (V0 * V0 * sinhTerm * sinhTerm) / (4 * E * (V0 - E)));

  return Math.min(1, Math.max(0, T));
}
