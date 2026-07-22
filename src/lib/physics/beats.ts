// Beats from wave superposition. Two tones close in frequency add point by point;
// the sum swells and fades at the difference of the two frequencies (the beat
// rate), while the fast oscillation you hear rides at their average (the carrier).

/**
 * Beat frequency |f1 - f2|: how many loud-soft pulses per second you perceive.
 * Throws RangeError unless both frequencies are positive.
 */
export function beatFrequency(f1: number, f2: number): number {
  if (!(f1 > 0 && f2 > 0)) {
    throw new RangeError(`f1 and f2 must be positive, got ${f1} and ${f2}`);
  }
  return Math.abs(f1 - f2);
}

/**
 * Carrier (average) frequency (f1 + f2) / 2: the tone you actually hear.
 * Throws RangeError unless both frequencies are positive.
 */
export function carrierFrequency(f1: number, f2: number): number {
  if (!(f1 > 0 && f2 > 0)) {
    throw new RangeError(`f1 and f2 must be positive, got ${f1} and ${f2}`);
  }
  return (f1 + f2) / 2;
}
