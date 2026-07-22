// One-dimensional two-body collision with a coefficient of restitution e.
// Momentum is always conserved; e (0..1) sets how much relative speed survives,
// which fixes how much kinetic energy is kept. e = 1 is a perfectly elastic
// bounce (energy conserved), e = 0 is perfectly inelastic (the bodies stick).

function assertInputs(m1: number, m2: number, e: number): void {
  if (!(m1 > 0)) throw new RangeError(`mass m1 must be positive, got ${m1}`);
  if (!(m2 > 0)) throw new RangeError(`mass m2 must be positive, got ${m2}`);
  if (!(e >= 0 && e <= 1)) throw new RangeError(`restitution e must be in [0, 1], got ${e}`);
}

/**
 * Final velocities after a 1D collision of masses m1, m2 with incoming
 * velocities u1, u2 and coefficient of restitution e. Combines conservation of
 * momentum with the restitution relation v2 − v1 = e·(u1 − u2).
 */
export function finalVelocities(
  m1: number,
  m2: number,
  u1: number,
  u2: number,
  e: number,
): { v1: number; v2: number } {
  assertInputs(m1, m2, e);
  const total = m1 + m2;
  const momentum = m1 * u1 + m2 * u2;
  const v1 = (momentum + m2 * e * (u2 - u1)) / total;
  const v2 = (momentum + m1 * e * (u1 - u2)) / total;
  return { v1, v2 };
}

/** Total kinetic energy (J) of the two bodies: ½m1v1² + ½m2v2². */
export function kineticEnergy(m1: number, m2: number, v1: number, v2: number): number {
  return 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
}
