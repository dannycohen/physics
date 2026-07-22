// Kepler's third law in Solar-System units: semi-major axis a in astronomical
// units (AU), orbital period T in years. In these units T^2 = a^3 exactly
// (the constant 4*pi^2/(G*M_sun) equals 1), so the relations are pure powers.

/** Orbital period in years for a semi-major axis given in AU: T = a^(3/2). Throws RangeError unless a > 0. */
export function orbitalPeriodYears(semiMajorAxisAu: number): number {
  if (!(semiMajorAxisAu > 0)) {
    throw new RangeError(`semiMajorAxisAu must be > 0, got ${semiMajorAxisAu}`);
  }
  return Math.sqrt(semiMajorAxisAu ** 3);
}

/** Semi-major axis in AU for a period given in years: a = cbrt(T^2). Throws RangeError unless T > 0. */
export function semiMajorAxisAu(periodYears: number): number {
  if (!(periodYears > 0)) {
    throw new RangeError(`periodYears must be > 0, got ${periodYears}`);
  }
  return Math.cbrt(periodYears ** 2);
}
