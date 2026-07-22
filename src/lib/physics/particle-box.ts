// Particle in a box (infinite square well): a quantum particle confined to a
// 1-D box of width L can only hold the discrete energies E_n = n^2 h^2 / (8 m L^2).
// The levels climb as n^2, and the ground state (n = 1) is never zero — a
// confined particle always keeps some minimum energy.

import { PLANCK_CONSTANT, ELEMENTARY_CHARGE } from './constants';

function assertInputs(n: number, massKg: number, widthM: number): void {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError(`quantum number n must be an integer >= 1, got ${n}`);
  }
  if (!(massKg > 0)) {
    throw new RangeError(`massKg must be positive, got ${massKg}`);
  }
  if (!(widthM > 0)) {
    throw new RangeError(`widthM must be positive, got ${widthM}`);
  }
}

/**
 * Energy of level n (joules) for a particle of mass massKg in a box of width
 * widthM. E_n = n^2 h^2 / (8 m L^2).
 * Throws RangeError unless n is an integer >= 1 and mass, width are positive.
 */
export function energyLevelJoules(n: number, massKg: number, widthM: number): number {
  assertInputs(n, massKg, widthM);
  return (n * n * PLANCK_CONSTANT * PLANCK_CONSTANT) / (8 * massKg * widthM * widthM);
}

/**
 * Energy of level n in electronvolts. Same guards as energyLevelJoules.
 */
export function energyLevelEv(n: number, massKg: number, widthM: number): number {
  return energyLevelJoules(n, massKg, widthM) / ELEMENTARY_CHARGE;
}
