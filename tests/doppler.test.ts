import { describe, expect, it } from 'vitest';
import { dopplerFactor, observedFrequency } from '../src/lib/physics/doppler';

describe('dopplerFactor', () => {
  it('is 1 at rest', () => {
    expect(dopplerFactor(0)).toBe(1);
  });

  it('is greater than 1 when approaching (blueshift)', () => {
    expect(dopplerFactor(0.6)).toBeGreaterThan(1);
  });

  it('is less than 1 when receding (redshift)', () => {
    expect(dopplerFactor(-0.6)).toBeLessThan(1);
  });

  it('is 2 at beta = 0.6 and 0.5 at beta = -0.6', () => {
    expect(dopplerFactor(0.6)).toBeCloseTo(2, 12);
    expect(dopplerFactor(-0.6)).toBeCloseTo(0.5, 12);
  });

  it('is reciprocal under sign flip: f(b) * f(-b) === 1', () => {
    for (const beta of [0.1, 0.3, 0.5, 0.6, 0.9]) {
      expect(dopplerFactor(beta) * dopplerFactor(-beta)).toBeCloseTo(1, 12);
    }
  });

  it('throws RangeError at the light-speed limits and beyond', () => {
    expect(() => dopplerFactor(1)).toThrow(RangeError);
    expect(() => dopplerFactor(-1)).toThrow(RangeError);
    expect(() => dopplerFactor(1.5)).toThrow(RangeError);
  });
});

describe('observedFrequency', () => {
  it('scales the source frequency linearly by the Doppler factor', () => {
    const beta = 0.6;
    const factor = dopplerFactor(beta);
    expect(observedFrequency(100, beta)).toBeCloseTo(100 * factor, 10);
    expect(observedFrequency(500, beta)).toBeCloseTo(500 * factor, 10);
    expect(observedFrequency(500, beta)).toBeCloseTo(5 * observedFrequency(100, beta), 10);
  });

  it('leaves the source frequency unchanged at rest', () => {
    expect(observedFrequency(440, 0)).toBe(440);
  });
});
