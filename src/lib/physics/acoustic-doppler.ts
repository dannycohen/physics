import { SPEED_OF_SOUND_AIR } from './constants';

// Acoustic (classical) Doppler effect for a moving source and a stationary
// observer in a still medium. Sign convention: positive sourceSpeed = the
// source moving TOWARD the observer (wavefronts bunch up, higher pitch);
// negative sourceSpeed = the source receding (wavefronts stretch, lower pitch).

/**
 * Observed frequency for a source moving toward a stationary observer at
 * sourceSpeed (positive = approaching, higher pitch; negative = receding):
 *
 *   f' = f · v / (v − sourceSpeed)
 *
 * v is the speed of sound in the medium, defaulting to SPEED_OF_SOUND_AIR.
 * The source must stay subsonic: throws RangeError if |sourceSpeed| >= v
 * (at v the denominator hits zero; beyond it the model breaks down).
 */
export function observedFrequency(
  sourceFreq: number,
  sourceSpeed: number,
  v: number = SPEED_OF_SOUND_AIR,
): number {
  if (!(Math.abs(sourceSpeed) < v)) {
    throw new RangeError(
      `sourceSpeed must be subsonic (|sourceSpeed| < ${v}), got ${sourceSpeed}`,
    );
  }
  return (sourceFreq * v) / (v - sourceSpeed);
}
