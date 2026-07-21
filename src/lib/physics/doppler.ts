// Longitudinal (line-of-sight) relativistic Doppler effect. beta = v/c is the
// closing speed: beta > 0 means source and observer approach (blueshift, factor
// > 1); beta < 0 means they recede (redshift, factor < 1).

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
