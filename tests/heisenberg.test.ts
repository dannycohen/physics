import { describe, expect, it } from 'vitest';
import { REDUCED_PLANCK } from '../src/lib/physics/constants';
import { minMomentumSpread, uncertaintyProduct } from '../src/lib/physics/heisenberg';

describe('minMomentumSpread', () => {
  it('saturates the bound: Δp·Δx equals ħ/2', () => {
    const dx = 1e-10;
    expect(minMomentumSpread(dx) * dx).toBeCloseTo(REDUCED_PLANCK / 2, 40);
  });

  it('halves when Δx doubles', () => {
    const dx = 2.5e-10;
    expect(minMomentumSpread(2 * dx)).toBeCloseTo(minMomentumSpread(dx) / 2, 40);
  });

  it('throws a RangeError on non-positive Δx', () => {
    expect(() => minMomentumSpread(0)).toThrow(RangeError);
    expect(() => minMomentumSpread(-1e-10)).toThrow(RangeError);
  });
});

describe('uncertaintyProduct', () => {
  it('returns Δx·Δp', () => {
    expect(uncertaintyProduct(3, 4)).toBe(12);
  });

  it('equals ħ/2 for a saturated (minimum-uncertainty) packet', () => {
    const dx = 4e-10;
    expect(uncertaintyProduct(dx, minMomentumSpread(dx))).toBeCloseTo(REDUCED_PLANCK / 2, 40);
  });
});
