import { COULOMB_CONSTANT } from './constants';

// Coulomb's law for point charges. Sign convention for the force: a positive
// result is repulsive (like charges), negative is attractive (opposite charges).

function assertSeparation(rMeters: number): void {
  if (!(rMeters > 0)) {
    throw new RangeError(`separation must be positive, got ${rMeters}`);
  }
}

/**
 * Signed Coulomb force (N) between charges q1, q2 (coulombs) a distance r (m)
 * apart. Positive means the charges repel, negative means they attract.
 */
export function coulombForce(q1: number, q2: number, rMeters: number): number {
  assertSeparation(rMeters);
  return (COULOMB_CONSTANT * q1 * q2) / (rMeters * rMeters);
}

/**
 * Electric field vector (V/m) at the offset (dx, dy) from a point charge q (C),
 * pointing away from a positive charge. Returns [0, 0] at the charge itself.
 * Distances may be in any consistent unit when only the field pattern (direction
 * and relative magnitude) is needed.
 */
export function fieldContribution(q: number, dx: number, dy: number): [number, number] {
  const r2 = dx * dx + dy * dy;
  if (r2 === 0) return [0, 0];
  const magnitude = (COULOMB_CONSTANT * q) / r2;
  const r = Math.sqrt(r2);
  return [(magnitude * dx) / r, (magnitude * dy) / r];
}
