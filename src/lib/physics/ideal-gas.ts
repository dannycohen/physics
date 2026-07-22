import { GAS_CONSTANT } from './constants';

// Ideal gas law, PV = nRT. Pressure in pascals from the amount of gas (moles),
// the absolute temperature (kelvin), and the volume (cubic metres).

/**
 * Pressure (Pa) of an ideal gas: P = nRT / V. Throws RangeError unless the
 * amount of gas, temperature, and volume are all strictly positive.
 */
export function pressure(nMoles: number, tempK: number, volumeM3: number): number {
  if (!(nMoles > 0)) throw new RangeError(`amount of gas must be positive, got ${nMoles}`);
  if (!(tempK > 0)) throw new RangeError(`temperature must be positive, got ${tempK}`);
  if (!(volumeM3 > 0)) throw new RangeError(`volume must be positive, got ${volumeM3}`);
  return (nMoles * GAS_CONSTANT * tempK) / volumeM3;
}
