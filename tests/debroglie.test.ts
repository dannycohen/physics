import { describe, expect, it } from 'vitest';
import { deBroglieWavelength } from '../src/lib/physics/debroglie';
import { ELECTRON_MASS } from '../src/lib/physics/constants';

describe('deBroglieWavelength', () => {
  it('is about 0.73 nm for an electron at 1e6 m/s', () => {
    // h / (m_e * v) = 6.626e-34 / (9.109e-31 * 1e6) ~= 7.27e-10 m.
    expect(deBroglieWavelength(ELECTRON_MASS, 1e6)).toBeCloseTo(7.27e-10, 12);
  });

  it('halves when the speed doubles', () => {
    const slow = deBroglieWavelength(ELECTRON_MASS, 1e6);
    const fast = deBroglieWavelength(ELECTRON_MASS, 2e6);
    expect(fast).toBeCloseTo(slow / 2, 20);
  });

  it('is shorter for a larger mass at the same speed', () => {
    const light = deBroglieWavelength(ELECTRON_MASS, 1e6);
    const heavy = deBroglieWavelength(ELECTRON_MASS * 1000, 1e6);
    expect(heavy).toBeLessThan(light);
  });

  it('throws RangeError on non-positive mass', () => {
    expect(() => deBroglieWavelength(0, 1e6)).toThrow(RangeError);
    expect(() => deBroglieWavelength(-ELECTRON_MASS, 1e6)).toThrow(RangeError);
  });

  it('throws RangeError on non-positive speed', () => {
    expect(() => deBroglieWavelength(ELECTRON_MASS, 0)).toThrow(RangeError);
    expect(() => deBroglieWavelength(ELECTRON_MASS, -1e6)).toThrow(RangeError);
  });
});
