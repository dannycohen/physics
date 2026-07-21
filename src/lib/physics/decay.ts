/** Fraction of a decaying quantity still present after time t, given its half-life.
 *  N/N0 = 2^(-t/halfLife) = exp(-t * ln2 / halfLife). Throws RangeError unless halfLife > 0.
 *  At t = 0 the fraction is 1; every half-life multiplies what is left by 1/2. */
export function remainingFraction(t: number, halfLife: number): number {
  if (!(halfLife > 0)) {
    throw new RangeError(`halfLife must be > 0, got ${halfLife}`);
  }
  return Math.pow(2, -t / halfLife);
}

/** Mean lifetime tau = halfLife / ln2, the time constant in N = N0 * exp(-t/tau).
 *  It is longer than the half-life (1/ln2 ~ 1.443 times it). */
export function meanLifetime(halfLife: number): number {
  return halfLife / Math.LN2;
}
