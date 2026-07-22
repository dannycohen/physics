// Snell's law of refraction for a ray crossing a flat interface between two
// media of refractive index n1 (incidence side) and n2 (transmission side):
//
//   n1 · sin θ1 = n2 · sin θ2
//
// Angles are measured from the surface normal. When light passes into a less
// dense medium (n1 > n2) at a steep enough angle, sin θ2 would exceed 1: no
// refracted ray exists and the light is totally internally reflected.

function assertIndex(n: number, which: string): void {
  if (!(n > 0)) {
    throw new RangeError(`${which} must be positive, got ${n}`);
  }
}

const DEG = Math.PI / 180;

/**
 * Refracted angle (degrees, from the normal) for a ray hitting the interface at
 * `incidentDeg`. Returns null when total internal reflection occurs, i.e. when
 * sin θ2 = (n1/n2)·sin θ1 exceeds 1 and the arcsin has no real solution.
 */
export function refractionAngleDeg(
  n1: number,
  n2: number,
  incidentDeg: number,
): number | null {
  assertIndex(n1, 'n1');
  assertIndex(n2, 'n2');
  if (!(incidentDeg >= 0 && incidentDeg < 90)) {
    throw new RangeError(`incident angle must be in [0, 90), got ${incidentDeg}`);
  }
  const sinT2 = (n1 / n2) * Math.sin(incidentDeg * DEG);
  if (sinT2 > 1) return null; // total internal reflection
  return Math.asin(sinT2) / DEG;
}

/**
 * Critical angle (degrees) above which a ray going from the denser medium n1
 * into the rarer medium n2 is totally internally reflected: arcsin(n2/n1).
 * Returns null when n1 <= n2, since no critical angle exists entering a denser
 * medium.
 */
export function criticalAngleDeg(n1: number, n2: number): number | null {
  assertIndex(n1, 'n1');
  assertIndex(n2, 'n2');
  if (!(n1 > n2)) return null;
  return Math.asin(n2 / n1) / DEG;
}
