// The Lorentz force on a moving charge in a magnetic field: F = q v × B.
// This module keeps to the magnetic term in a clean 2D setup: the velocity lies
// in the xy-plane and B points out of the plane along +z, so F = q v × B also
// lies in the xy-plane, perpendicular to v.
//
// The magnetic force is always perpendicular to v, so it does no work and cannot
// change the charge's speed; it only steers, curving the path into a circle.

/**
 * Magnitude of the magnetic force (N) on a charge q (C) moving at speed v (m/s)
 * through a magnetic field B (T): |F| = |q|·v·B·sin(angle between v and B).
 *
 * With v in the plane and B perpendicular to it (out of plane), the angle is 90°
 * and |F| = |q|vB. The angle is kept general and defaults to 90°.
 */
export function magneticForceMagnitude(
  q: number,
  speed: number,
  bField: number,
  angleDeg = 90,
): number {
  if (!(speed >= 0)) {
    throw new RangeError(`speed must be non-negative, got ${speed}`);
  }
  if (!(bField >= 0)) {
    throw new RangeError(`bField must be non-negative, got ${bField}`);
  }
  const angleRad = (angleDeg * Math.PI) / 180;
  return Math.abs(q) * speed * bField * Math.sin(angleRad);
}

/**
 * Radius (m) of the circular path a charge follows when the magnetic force is
 * perpendicular to its velocity: r = m v / (|q| B). The force supplies the
 * centripetal pull, so a heavier or faster charge sweeps a wider circle and a
 * stronger field tightens it.
 */
export function radius(mass: number, q: number, speed: number, bField: number): number {
  if (!(mass > 0)) {
    throw new RangeError(`mass must be positive, got ${mass}`);
  }
  if (!(Math.abs(q) > 0)) {
    throw new RangeError(`charge must be non-zero, got ${q}`);
  }
  if (!(bField > 0)) {
    throw new RangeError(`bField must be positive, got ${bField}`);
  }
  return (mass * speed) / (Math.abs(q) * bField);
}
