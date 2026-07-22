// Interference of light passing through two slits (or a diffraction grating).
// Bright fringes appear where the path difference between neighbouring slits is
// a whole number of wavelengths:
//
//   d · sin θ = m · λ
//
// with d the slit spacing, θ the angle to the fringe, m the integer order, and
// λ the wavelength. Only orders with m·λ ≤ d exist, since sin θ cannot exceed 1.

const DEG = 180 / Math.PI;

function assertPositive(value: number, which: string): void {
  if (!(value > 0)) {
    throw new RangeError(`${which} must be positive, got ${value}`);
  }
}

/**
 * Angle (degrees) of the m-th bright fringe from d·sin θ = m·λ. Returns null
 * when m·λ/d exceeds 1, i.e. that order does not fit and the arcsin has no real
 * solution. Order 0 always sits at 0°.
 */
export function maximaAngleDeg(
  order: number,
  wavelengthNm: number,
  slitSpacingNm: number,
): number | null {
  if (!(Number.isInteger(order) && order >= 0)) {
    throw new RangeError(`order must be a non-negative integer, got ${order}`);
  }
  assertPositive(wavelengthNm, 'wavelength');
  assertPositive(slitSpacingNm, 'slit spacing');
  const sinTheta = (order * wavelengthNm) / slitSpacingNm;
  if (sinTheta > 1) return null; // this order does not exist
  return Math.asin(sinTheta) * DEG;
}

/**
 * Number of bright orders on each side of the centre, floor(d/λ). This is the
 * largest m for which m·λ ≤ d, so every order from 1 to highestOrder exists.
 */
export function highestOrder(wavelengthNm: number, slitSpacingNm: number): number {
  assertPositive(wavelengthNm, 'wavelength');
  assertPositive(slitSpacingNm, 'slit spacing');
  return Math.floor(slitSpacingNm / wavelengthNm);
}
