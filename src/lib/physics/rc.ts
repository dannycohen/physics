/** Fraction of the final voltage a charging capacitor has reached after time t,
 *  given the time constant tau = RC. V/V0 = 1 - exp(-t/tau). Throws RangeError
 *  unless tau > 0. At t = 0 the fraction is 0; it rises toward 1 without ever
 *  reaching it. One tau reaches 1 - 1/e (~63%); five tau reaches ~99.3%. */
export function chargeFraction(t: number, tau: number): number {
  if (!(tau > 0)) {
    throw new RangeError(`tau must be > 0, got ${tau}`);
  }
  return 1 - Math.exp(-t / tau);
}

/** Time constant tau = R * C (seconds) for a resistor R (ohms) in series with a
 *  capacitor C (farads). It sets the rate of charging. Throws RangeError unless
 *  both R and C are > 0. */
export function timeConstant(resistanceOhm: number, capacitanceFarad: number): number {
  if (!(resistanceOhm > 0)) {
    throw new RangeError(`resistanceOhm must be > 0, got ${resistanceOhm}`);
  }
  if (!(capacitanceFarad > 0)) {
    throw new RangeError(`capacitanceFarad must be > 0, got ${capacitanceFarad}`);
  }
  return resistanceOhm * capacitanceFarad;
}
