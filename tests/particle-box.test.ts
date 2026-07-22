import { describe, expect, it } from 'vitest';
import { ELECTRON_MASS } from '../src/lib/physics/constants';
import { energyLevelJoules, energyLevelEv } from '../src/lib/physics/particle-box';

describe('energyLevelJoules', () => {
  it('scales as n squared', () => {
    const e1 = energyLevelJoules(1, ELECTRON_MASS, 1e-9);
    expect(energyLevelJoules(2, ELECTRON_MASS, 1e-9)).toBeCloseTo(4 * e1, 30);
    expect(energyLevelJoules(3, ELECTRON_MASS, 1e-9)).toBeCloseTo(9 * e1, 30);
  });

  it('scales as one over L squared (double L -> quarter energy)', () => {
    const narrow = energyLevelJoules(1, ELECTRON_MASS, 0.5e-9);
    const wide = energyLevelJoules(1, ELECTRON_MASS, 1e-9);
    expect(wide).toBeCloseTo(narrow / 4, 30);
  });

  it('has a nonzero ground state', () => {
    expect(energyLevelJoules(1, ELECTRON_MASS, 0.5e-9)).toBeGreaterThan(0);
  });

  it('throws on invalid inputs', () => {
    expect(() => energyLevelJoules(0, ELECTRON_MASS, 1e-9)).toThrow(RangeError);
    expect(() => energyLevelJoules(-1, ELECTRON_MASS, 1e-9)).toThrow(RangeError);
    expect(() => energyLevelJoules(1.5, ELECTRON_MASS, 1e-9)).toThrow(RangeError);
    expect(() => energyLevelJoules(1, 0, 1e-9)).toThrow(RangeError);
    expect(() => energyLevelJoules(1, -1, 1e-9)).toThrow(RangeError);
    expect(() => energyLevelJoules(1, ELECTRON_MASS, 0)).toThrow(RangeError);
    expect(() => energyLevelJoules(1, ELECTRON_MASS, -1e-9)).toThrow(RangeError);
  });
});

describe('energyLevelEv', () => {
  it('gives about 1.5 eV for an electron in a 0.5 nm box (n=1)', () => {
    expect(energyLevelEv(1, ELECTRON_MASS, 0.5e-9)).toBeCloseTo(1.5, 1);
  });

  it('keeps the n squared scaling in eV', () => {
    const e1 = energyLevelEv(1, ELECTRON_MASS, 0.5e-9);
    expect(energyLevelEv(2, ELECTRON_MASS, 0.5e-9)).toBeCloseTo(4 * e1, 6);
  });

  it('throws on invalid inputs', () => {
    expect(() => energyLevelEv(0, ELECTRON_MASS, 1e-9)).toThrow(RangeError);
    expect(() => energyLevelEv(1, ELECTRON_MASS, -1e-9)).toThrow(RangeError);
  });
});
