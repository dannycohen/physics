import { describe, expect, it } from 'vitest';
import { COULOMB_CONSTANT } from '../src/lib/physics/constants';
import { coulombForce, fieldContribution } from '../src/lib/physics/electrostatics';

describe('coulombForce', () => {
  it('gives F = k for two 1 C charges 1 m apart', () => {
    expect(coulombForce(1, 1, 1)).toBeCloseTo(COULOMB_CONSTANT, 0);
  });

  it('falls off as one over r squared', () => {
    expect(coulombForce(1, 1, 2)).toBeCloseTo(coulombForce(1, 1, 1) / 4, 6);
    expect(coulombForce(1, 1, 0.5)).toBeCloseTo(coulombForce(1, 1, 1) * 4, 6);
  });

  it('is positive (repulsive) for like charges, negative (attractive) for unlike', () => {
    expect(coulombForce(2, 3, 1)).toBeGreaterThan(0);
    expect(coulombForce(2, -3, 1)).toBeLessThan(0);
    expect(coulombForce(2, -3, 1)).toBeCloseTo(-coulombForce(2, 3, 1), 6);
  });

  it('scales linearly with each charge', () => {
    const base = coulombForce(1e-6, 1e-6, 1);
    expect(base).toBeCloseTo(8.9875e-3, 5);
    expect(coulombForce(2e-6, 1e-6, 1)).toBeCloseTo(base * 2, 12);
  });

  it('throws on non-positive separation', () => {
    expect(() => coulombForce(1, 1, 0)).toThrow(RangeError);
    expect(() => coulombForce(1, 1, -1)).toThrow(RangeError);
  });
});

describe('fieldContribution', () => {
  it('points away from a positive charge and toward a negative one', () => {
    expect(fieldContribution(1, 1, 0)).toEqual([COULOMB_CONSTANT, 0]);
    expect(fieldContribution(-1, 1, 0)[0]).toBeCloseTo(-COULOMB_CONSTANT, 0);
  });

  it('falls off as one over r squared in magnitude', () => {
    const near = fieldContribution(1, 1, 0)[0];
    const far = fieldContribution(1, 2, 0)[0];
    expect(far).toBeCloseTo(near / 4, 6);
  });

  it('is zero at the charge itself', () => {
    expect(fieldContribution(5, 0, 0)).toEqual([0, 0]);
  });
});
