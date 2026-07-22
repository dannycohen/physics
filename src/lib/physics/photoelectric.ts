// The photoelectric effect: light delivers energy in photons of energy E = hf.
// A single photon can eject one electron from a metal only if its energy clears
// the metal's work function phi; whatever is left over becomes the electron's
// kinetic energy. Brighter light means more photons, not more energetic ones, so
// below the threshold frequency no electrons escape however bright the beam.
//
// Everything here is expressed in electronvolts (eV) for readability, converting
// the SI joules from the constants to eV via the elementary charge.

import { PLANCK_CONSTANT, C, ELEMENTARY_CHARGE } from './constants';

/**
 * Photon energy in electronvolts for light of the given wavelength (nm).
 * E(eV) = h*c / (lambda) / e. Throws RangeError unless wavelengthNm > 0.
 */
export function photonEnergyEv(wavelengthNm: number): number {
  if (!(wavelengthNm > 0)) {
    throw new RangeError(`wavelengthNm must be positive, got ${wavelengthNm}`);
  }
  const energyJoules = (PLANCK_CONSTANT * C) / (wavelengthNm * 1e-9);
  return energyJoules / ELEMENTARY_CHARGE;
}

/**
 * Maximum kinetic energy (eV) of an ejected electron: the photon energy minus
 * the work function. Clamped to 0 below threshold, where no electron escapes and
 * there is no such thing as negative kinetic energy.
 */
export function maxKineticEnergyEv(wavelengthNm: number, workFunctionEv: number): number {
  return Math.max(0, photonEnergyEv(wavelengthNm) - workFunctionEv);
}

/**
 * Threshold wavelength (nm): the longest wavelength (lowest frequency) that can
 * still eject an electron, where the photon energy exactly equals the work
 * function. Longer wavelengths carry too little energy per photon.
 */
export function thresholdWavelengthNm(workFunctionEv: number): number {
  if (!(workFunctionEv > 0)) {
    throw new RangeError(`workFunctionEv must be positive, got ${workFunctionEv}`);
  }
  const energyJoules = workFunctionEv * ELEMENTARY_CHARGE;
  return ((PLANCK_CONSTANT * C) / energyJoules) * 1e9;
}
