import { describe, expect, it } from 'vitest';
import { clockRate } from '../src/lib/physics/gravitational-dilation';

describe('clockRate', () => {
  it('is sqrt(0.5) ~ 0.7071 at rOverRs = 2', () => {
    expect(clockRate(2)).toBeCloseTo(Math.SQRT1_2, 12);
    expect(clockRate(2)).toBeCloseTo(0.7071, 4);
  });

  it('approaches 1 as rOverRs -> infinity', () => {
    expect(clockRate(1e6)).toBeCloseTo(1, 5);
    expect(clockRate(1e6)).toBeLessThan(1);
  });

  it('is near zero just above the horizon', () => {
    expect(clockRate(1.0001)).toBeLessThan(0.01);
    expect(clockRate(1.0001)).toBeGreaterThan(0);
  });

  it('is strictly increasing in rOverRs', () => {
    let prev = clockRate(1.01);
    for (let i = 1; i <= 200; i++) {
      const next = clockRate(1.01 + i * 0.5);
      expect(next).toBeGreaterThan(prev);
      prev = next;
    }
  });

  it('throws RangeError at and inside the horizon', () => {
    expect(() => clockRate(1)).toThrow(RangeError);
    expect(() => clockRate(0.5)).toThrow(RangeError);
  });
});
