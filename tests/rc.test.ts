import { describe, expect, it } from 'vitest';
import { chargeFraction, timeConstant } from '../src/lib/physics/rc';

describe('chargeFraction', () => {
  const tau = 1e-3;

  it('is 0 at t = 0', () => {
    expect(chargeFraction(0, tau)).toBe(0);
  });

  it('is 1 - 1/e (~0.632) after one time constant', () => {
    expect(chargeFraction(tau, tau)).toBeCloseTo(1 - 1 / Math.E, 12);
    expect(chargeFraction(tau, tau)).toBeCloseTo(0.632, 3);
  });

  it('is ~0.993 after five time constants (nearly fully charged)', () => {
    expect(chargeFraction(5 * tau, tau)).toBeCloseTo(0.993, 3);
  });

  it('is strictly monotonic increasing toward 1', () => {
    let prev = chargeFraction(0, tau);
    for (let i = 1; i <= 200; i++) {
      const next = chargeFraction((i / 200) * 5 * tau, tau);
      expect(next).toBeGreaterThan(prev);
      expect(next).toBeLessThan(1);
      prev = next;
    }
  });

  it('throws RangeError for a non-positive time constant', () => {
    expect(() => chargeFraction(1, 0)).toThrow(RangeError);
    expect(() => chargeFraction(1, -5)).toThrow(RangeError);
  });
});

describe('timeConstant', () => {
  it('is R * C: 1000 ohm and 1 uF gives 1 ms', () => {
    expect(timeConstant(1000, 1e-6)).toBeCloseTo(1e-3, 12);
  });

  it('throws RangeError for a non-positive resistance or capacitance', () => {
    expect(() => timeConstant(0, 1e-6)).toThrow(RangeError);
    expect(() => timeConstant(-100, 1e-6)).toThrow(RangeError);
    expect(() => timeConstant(1000, 0)).toThrow(RangeError);
    expect(() => timeConstant(1000, -1e-6)).toThrow(RangeError);
  });
});
