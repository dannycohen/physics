import { describe, expect, it } from 'vitest';
import { orbitalPeriodYears, semiMajorAxisAu } from '../src/lib/physics/kepler';

describe('orbitalPeriodYears', () => {
  it('gives Earth a 1-year period at 1 AU', () => {
    expect(orbitalPeriodYears(1)).toBeCloseTo(1, 12);
  });

  it('matches Mars: 1.524 AU -> about 1.881 yr', () => {
    expect(orbitalPeriodYears(1.524)).toBeCloseTo(1.881, 2);
  });

  it('matches Jupiter: 5.203 AU -> about 11.86 yr', () => {
    expect(orbitalPeriodYears(5.203)).toBeCloseTo(11.86, 1);
  });

  it('satisfies T^2 = a^3 for several axes', () => {
    for (const a of [0.39, 0.72, 1, 1.524, 5.203, 9.58, 30.07]) {
      const T = orbitalPeriodYears(a);
      expect(T * T).toBeCloseTo(a ** 3, 9);
    }
  });

  it('throws RangeError for a non-positive axis', () => {
    expect(() => orbitalPeriodYears(0)).toThrow(RangeError);
    expect(() => orbitalPeriodYears(-1)).toThrow(RangeError);
  });
});

describe('semiMajorAxisAu', () => {
  it('gives 1 AU for a 1-year period', () => {
    expect(semiMajorAxisAu(1)).toBeCloseTo(1, 12);
  });

  it('recovers Jupiter: 11.86 yr -> about 5.20 AU', () => {
    expect(semiMajorAxisAu(11.86)).toBeCloseTo(5.203, 2);
  });

  it('throws RangeError for a non-positive period', () => {
    expect(() => semiMajorAxisAu(0)).toThrow(RangeError);
    expect(() => semiMajorAxisAu(-2)).toThrow(RangeError);
  });
});

describe('inverse round-trips', () => {
  it('a -> T -> a returns the original axis', () => {
    for (const a of [0.3, 1, 1.524, 5.203, 30.07, 40]) {
      expect(semiMajorAxisAu(orbitalPeriodYears(a))).toBeCloseTo(a, 9);
    }
  });

  it('T -> a -> T returns the original period', () => {
    for (const T of [0.24, 1, 1.881, 11.86, 164.8]) {
      expect(orbitalPeriodYears(semiMajorAxisAu(T))).toBeCloseTo(T, 9);
    }
  });
});
