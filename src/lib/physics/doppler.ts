// Longitudinal (line-of-sight) relativistic Doppler effect for source and
// observer in a local inertial setting. beta = v/c is their closing speed:
// beta > 0 means approach (blueshift, factor > 1); beta < 0 means recession
// (redshift, factor < 1). This is not a cosmological-redshift model.

/**
 * Relativistic Doppler factor sqrt((1 + beta) / (1 - beta)).
 * Throws RangeError unless -1 < beta < 1.
 */
export function dopplerFactor(beta: number): number {
  if (!(beta > -1 && beta < 1)) {
    throw new RangeError(`beta must satisfy -1 < beta < 1, got ${beta}`);
  }
  return Math.sqrt((1 + beta) / (1 - beta));
}

/** Observed frequency = source frequency times the Doppler factor. */
export function observedFrequency(sourceFreq: number, beta: number): number {
  return sourceFreq * dopplerFactor(beta);
}
