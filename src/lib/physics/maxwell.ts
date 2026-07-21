import { BOLTZMANN } from './constants';

// Maxwell-Boltzmann distribution of molecular SPEEDS (not velocity components).
// The speed distribution carries a 4*pi*v^2 spherical-shell factor, so it starts
// at zero, peaks at the most probable speed, and trails off in a long fast tail.
// This is why the three characteristic speeds differ: v_p < v_mean < v_rms.

function assertPositive(massKg: number, tempK: number): void {
  if (!(massKg > 0) || !(tempK > 0)) {
    throw new RangeError(`mass and temperature must be positive, got m=${massKg}, T=${tempK}`);
  }
}

/**
 * Probability density f(v) of the molecular speed v (m/s) for a gas of
 * particles of mass `massKg` at temperature `tempK`. Units: s/m. Integrates to 1
 * over v in [0, infinity). Returns 0 for v <= 0.
 */
export function speedDistribution(v: number, massKg: number, tempK: number): number {
  assertPositive(massKg, tempK);
  if (v <= 0) return 0;
  const twoKT = 2 * BOLTZMANN * tempK;
  const a = massKg / (Math.PI * twoKT);
  return 4 * Math.PI * Math.pow(a, 1.5) * v * v * Math.exp((-massKg * v * v) / twoKT);
}

/** Most probable speed, sqrt(2 k T / m): the peak of the distribution. */
export function mostProbableSpeed(massKg: number, tempK: number): number {
  assertPositive(massKg, tempK);
  return Math.sqrt((2 * BOLTZMANN * tempK) / massKg);
}

/** Mean (average) speed, sqrt(8 k T / (pi m)). Always above the most probable speed. */
export function meanSpeed(massKg: number, tempK: number): number {
  assertPositive(massKg, tempK);
  return Math.sqrt((8 * BOLTZMANN * tempK) / (Math.PI * massKg));
}

/** Root-mean-square speed, sqrt(3 k T / m): the speed that sets the mean kinetic energy. */
export function rmsSpeed(massKg: number, tempK: number): number {
  assertPositive(massKg, tempK);
  return Math.sqrt((3 * BOLTZMANN * tempK) / massKg);
}
