import { describe, expect, it } from 'vitest';
import { finalVelocities, kineticEnergy } from '../src/lib/physics/collision';

describe('finalVelocities', () => {
  it('swaps velocities for equal masses in an elastic collision', () => {
    const { v1, v2 } = finalVelocities(1, 1, 2, 0, 1);
    expect(v1).toBeCloseTo(0, 12);
    expect(v2).toBeCloseTo(2, 12);
  });

  it('conserves momentum for any e', () => {
    const m1 = 2;
    const m2 = 3;
    const u1 = 4;
    const u2 = -1;
    const before = m1 * u1 + m2 * u2;
    for (const e of [0, 0.25, 0.5, 0.75, 1]) {
      const { v1, v2 } = finalVelocities(m1, m2, u1, u2, e);
      expect(m1 * v1 + m2 * v2).toBeCloseTo(before, 10);
    }
  });

  it('gives a single centre-of-mass velocity when perfectly inelastic', () => {
    const m1 = 2;
    const m2 = 3;
    const u1 = 4;
    const u2 = -1;
    const { v1, v2 } = finalVelocities(m1, m2, u1, u2, 0);
    const vCm = (m1 * u1 + m2 * u2) / (m1 + m2);
    expect(v1).toBeCloseTo(v2, 12);
    expect(v1).toBeCloseTo(vCm, 12);
  });

  it('throws on non-positive mass or out-of-range e', () => {
    expect(() => finalVelocities(0, 1, 1, 0, 1)).toThrow(RangeError);
    expect(() => finalVelocities(1, -1, 1, 0, 1)).toThrow(RangeError);
    expect(() => finalVelocities(1, 1, 1, 0, -0.1)).toThrow(RangeError);
    expect(() => finalVelocities(1, 1, 1, 0, 1.5)).toThrow(RangeError);
  });
});

describe('kineticEnergy', () => {
  it('conserves kinetic energy in an elastic collision', () => {
    const m1 = 2;
    const m2 = 3;
    const u1 = 4;
    const u2 = -1;
    const before = kineticEnergy(m1, m2, u1, u2);
    const { v1, v2 } = finalVelocities(m1, m2, u1, u2, 1);
    expect(kineticEnergy(m1, m2, v1, v2)).toBeCloseTo(before, 10);
  });

  it('loses kinetic energy in an inelastic collision', () => {
    const m1 = 2;
    const m2 = 3;
    const u1 = 4;
    const u2 = -1;
    const before = kineticEnergy(m1, m2, u1, u2);
    const { v1, v2 } = finalVelocities(m1, m2, u1, u2, 0);
    expect(kineticEnergy(m1, m2, v1, v2)).toBeLessThan(before);
  });
});
