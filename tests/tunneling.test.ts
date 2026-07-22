import { describe, expect, it } from 'vitest';
import { transmission } from '../src/lib/physics/tunneling';
import {
  REDUCED_PLANCK,
  ELECTRON_MASS,
  ELEMENTARY_CHARGE,
} from '../src/lib/physics/constants';

// Recompute the expected value from the same closed form and constants so the
// test is not pinned to a hand-typed magic number.
function expected(energyEv: number, v0Ev: number, widthNm: number, massKg = ELECTRON_MASS): number {
  const a = widthNm * 1e-9;
  const kappa = Math.sqrt(2 * massKg * (v0Ev - energyEv) * ELEMENTARY_CHARGE) / REDUCED_PLANCK;
  const s = Math.sinh(kappa * a);
  return 1 / (1 + (v0Ev * v0Ev * s * s) / (4 * energyEv * (v0Ev - energyEv)));
}

describe('transmission', () => {
  it('gives a small but nonzero probability for an electron, E=1 eV, V0=2 eV, a=0.5 nm', () => {
    const T = transmission(1, 2, 0.5);
    expect(T).toBeGreaterThan(0);
    expect(T).toBeLessThan(1);
    // Matches the independently recomputed closed form.
    expect(T).toBeCloseTo(expected(1, 2, 0.5), 12);
    // Sanity band: this is a strongly suppressed but real tunnelling probability.
    expect(T).toBeGreaterThan(1e-4);
    expect(T).toBeLessThan(0.1);
  });

  it('stays within (0, 1) across the tunnelling regime', () => {
    for (const w of [0.1, 0.5, 1, 1.5]) {
      for (const e of [0.3, 1, 1.8]) {
        const T = transmission(e, 2, w);
        expect(T).toBeGreaterThan(0);
        expect(T).toBeLessThan(1);
      }
    }
  });

  it('decreases as the barrier grows thicker', () => {
    const thin = transmission(1, 2, 0.3);
    const mid = transmission(1, 2, 0.6);
    const thick = transmission(1, 2, 1.2);
    expect(mid).toBeLessThan(thin);
    expect(thick).toBeLessThan(mid);
    // Roughly exponential falloff: doubling the width shrinks T by orders of magnitude.
    expect(thick).toBeLessThan(thin / 100);
  });

  it('decreases as (V0 - E) grows: higher barrier above the energy is harder to cross', () => {
    const shallow = transmission(1, 1.5, 0.5); // V0 - E = 0.5 eV
    const deeper = transmission(1, 2, 0.5); //   V0 - E = 1.0 eV
    const deepest = transmission(1, 3, 0.5); //  V0 - E = 2.0 eV
    expect(deeper).toBeLessThan(shallow);
    expect(deepest).toBeLessThan(deeper);
  });

  it('throws RangeError when E >= V0 (outside the tunnelling regime)', () => {
    expect(() => transmission(2, 2, 0.5)).toThrow(RangeError);
    expect(() => transmission(3, 2, 0.5)).toThrow(RangeError);
  });

  it('throws RangeError on non-positive inputs', () => {
    expect(() => transmission(0, 2, 0.5)).toThrow(RangeError);
    expect(() => transmission(-1, 2, 0.5)).toThrow(RangeError);
    expect(() => transmission(1, 0, 0.5)).toThrow(RangeError);
    expect(() => transmission(1, 2, 0)).toThrow(RangeError);
    expect(() => transmission(1, 2, -0.5)).toThrow(RangeError);
    expect(() => transmission(1, 2, 0.5, 0)).toThrow(RangeError);
  });
});
