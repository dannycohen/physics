import { describe, expect, it } from 'vitest';
import {
  photonEnergyEv,
  maxKineticEnergyEv,
  thresholdWavelengthNm,
} from '../src/lib/physics/photoelectric';

describe('photonEnergyEv', () => {
  it('gives about 2.48 eV for 500 nm green light', () => {
    expect(photonEnergyEv(500)).toBeCloseTo(2.48, 2);
  });

  it('rises as wavelength shrinks (shorter wave = more energy per photon)', () => {
    expect(photonEnergyEv(250)).toBeGreaterThan(photonEnergyEv(500));
    expect(photonEnergyEv(250)).toBeCloseTo(photonEnergyEv(500) * 2, 6);
  });

  it('throws on non-positive wavelength', () => {
    expect(() => photonEnergyEv(0)).toThrow(RangeError);
    expect(() => photonEnergyEv(-100)).toThrow(RangeError);
  });
});

describe('maxKineticEnergyEv', () => {
  it('is 0 below threshold (photon energy under the work function)', () => {
    // 600 nm is about 2.07 eV, below a 3 eV work function: no emission.
    expect(photonEnergyEv(600)).toBeLessThan(3);
    expect(maxKineticEnergyEv(600, 3)).toBe(0);
  });

  it('is positive above threshold', () => {
    expect(maxKineticEnergyEv(400, 2.3)).toBeGreaterThan(0);
  });

  it('equals photon energy minus work function above threshold', () => {
    expect(maxKineticEnergyEv(400, 2.3)).toBeCloseTo(photonEnergyEv(400) - 2.3, 6);
  });

  it('never returns a negative energy', () => {
    expect(maxKineticEnergyEv(700, 4.3)).toBeGreaterThanOrEqual(0);
  });
});

describe('thresholdWavelengthNm', () => {
  it('gives about 620 nm for a 2 eV work function', () => {
    expect(thresholdWavelengthNm(2)).toBeCloseTo(620, 0);
  });

  it('is the wavelength whose photon energy equals the work function', () => {
    const lambda = thresholdWavelengthNm(2.3);
    expect(photonEnergyEv(lambda)).toBeCloseTo(2.3, 6);
    // exactly at threshold, no kinetic energy left over
    expect(maxKineticEnergyEv(lambda, 2.3)).toBeCloseTo(0, 6);
  });
});
