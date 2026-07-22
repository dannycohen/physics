import { describe, expect, it } from 'vitest';
import { pressure } from '../src/lib/physics/ideal-gas';

describe('pressure', () => {
  it('is about one atmosphere at STP (1 mol, 273.15 K, 22.414 L)', () => {
    // 1 mol of an ideal gas at 0 °C occupies 22.414 L and sits at ~101325 Pa.
    expect(pressure(1, 273.15, 0.022414)).toBeCloseTo(101325, -2.5);
  });

  it('doubles when temperature doubles', () => {
    const p1 = pressure(1, 300, 0.024);
    const p2 = pressure(1, 600, 0.024);
    expect(p2).toBeCloseTo(2 * p1, 6);
  });

  it('halves when volume doubles', () => {
    const p1 = pressure(1, 300, 0.024);
    const p2 = pressure(1, 300, 0.048);
    expect(p2).toBeCloseTo(p1 / 2, 6);
  });

  it('scales linearly with the amount of gas', () => {
    const p1 = pressure(1, 300, 0.024);
    const p2 = pressure(3, 300, 0.024);
    expect(p2).toBeCloseTo(3 * p1, 6);
  });

  it('throws RangeError on non-positive inputs', () => {
    expect(() => pressure(0, 300, 0.024)).toThrow(RangeError);
    expect(() => pressure(-1, 300, 0.024)).toThrow(RangeError);
    expect(() => pressure(1, 0, 0.024)).toThrow(RangeError);
    expect(() => pressure(1, -300, 0.024)).toThrow(RangeError);
    expect(() => pressure(1, 300, 0)).toThrow(RangeError);
    expect(() => pressure(1, 300, -0.024)).toThrow(RangeError);
  });
});
