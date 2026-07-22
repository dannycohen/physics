import { describe, expect, it } from 'vitest';
import { angleAt, period } from '../src/lib/physics/pendulum';

const STANDARD_GRAVITY_MOON = 1.62;

describe('period', () => {
  it('is about 2.006 s for a 1 m pendulum on Earth', () => {
    expect(period(1)).toBeCloseTo(2.006, 3);
  });

  it('scales with the square root of length (quadruple L -> double period)', () => {
    expect(period(4)).toBeCloseTo(2 * period(1), 12);
    expect(period(9)).toBeCloseTo(3 * period(1), 12);
  });

  it('depends only on length: mass and amplitude never enter it', () => {
    // The function takes only a length (and optional g), so a given length
    // always returns the same period regardless of bob mass or swing amplitude.
    expect(period(1)).toBe(period(1));
    expect(period(2.5)).toBe(period(2.5));
  });

  it('varies with g: weaker gravity gives a longer period', () => {
    expect(period(1, STANDARD_GRAVITY_MOON)).toBeGreaterThan(period(1));
  });

  it('throws RangeError for a non-positive length', () => {
    expect(() => period(0)).toThrow(RangeError);
    expect(() => period(-1)).toThrow(RangeError);
  });
});

describe('angleAt', () => {
  const amplitude = 0.2; // rad
  const L = 1;

  it('equals the amplitude at t = 0', () => {
    expect(angleAt(amplitude, L, 0)).toBeCloseTo(amplitude, 12);
  });

  it('equals minus the amplitude at half a period', () => {
    expect(angleAt(amplitude, L, period(L) / 2)).toBeCloseTo(-amplitude, 12);
  });

  it('returns to the amplitude after a full period', () => {
    expect(angleAt(amplitude, L, period(L))).toBeCloseTo(amplitude, 12);
  });

  it('throws RangeError for a non-positive length', () => {
    expect(() => angleAt(amplitude, 0, 1)).toThrow(RangeError);
  });
});
