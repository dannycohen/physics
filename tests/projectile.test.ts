import { describe, expect, it } from 'vitest';
import { STANDARD_GRAVITY } from '../src/lib/physics/constants';
import { maxHeight, range, timeOfFlight } from '../src/lib/physics/projectile';

describe('range', () => {
  it('is largest at 45 degrees', () => {
    const best = range(20, 45);
    for (const angle of [10, 20, 30, 40, 44, 46, 50, 60, 70, 80]) {
      expect(range(20, angle)).toBeLessThan(best);
    }
  });

  it('is equal for complementary angles (θ and 90 − θ)', () => {
    for (const angle of [10, 20, 30, 37]) {
      expect(range(15, angle)).toBeCloseTo(range(15, 90 - angle), 9);
    }
  });

  it('equals v² / g at 45 degrees: 10 m/s gives about 10.2 m', () => {
    expect(range(10, 45)).toBeCloseTo(100 / STANDARD_GRAVITY, 9);
    expect(range(10, 45)).toBeCloseTo(10.2, 1);
  });

  it('scales with the square of launch speed', () => {
    const base = range(5, 30);
    expect(range(10, 30)).toBeCloseTo(base * 4, 9); // double v -> 4x range
    expect(range(15, 30)).toBeCloseTo(base * 9, 9); // triple v -> 9x range
  });

  it('is zero for a flat shot (θ = 0)', () => {
    expect(range(20, 0)).toBeCloseTo(0, 12);
  });

  it('is zero straight up (θ = 90)', () => {
    expect(range(20, 90)).toBeCloseTo(0, 12);
  });

  it('accepts a custom gravity and rejects negative speed', () => {
    expect(range(10, 45, 9.80665 / 6)).toBeGreaterThan(range(10, 45)); // lower g -> farther
    expect(() => range(-1, 45)).toThrow(RangeError);
  });
});

describe('maxHeight', () => {
  it('is highest straight up and zero flat', () => {
    expect(maxHeight(20, 90)).toBeGreaterThan(maxHeight(20, 45));
    expect(maxHeight(20, 0)).toBeCloseTo(0, 12);
  });

  it('equals v² / (2g) straight up', () => {
    expect(maxHeight(20, 90)).toBeCloseTo((20 * 20) / (2 * STANDARD_GRAVITY), 9);
  });

  it('rejects negative speed', () => {
    expect(() => maxHeight(-1, 45)).toThrow(RangeError);
  });
});

describe('timeOfFlight', () => {
  it('grows with launch angle and is zero flat', () => {
    expect(timeOfFlight(20, 90)).toBeGreaterThan(timeOfFlight(20, 45));
    expect(timeOfFlight(20, 0)).toBeCloseTo(0, 12);
  });

  it('equals 2 v sinθ / g', () => {
    expect(timeOfFlight(20, 30)).toBeCloseTo((2 * 20 * Math.sin(Math.PI / 6)) / STANDARD_GRAVITY, 9);
  });

  it('rejects negative speed', () => {
    expect(() => timeOfFlight(-1, 45)).toThrow(RangeError);
  });
});
