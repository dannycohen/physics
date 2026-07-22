import { describe, expect, it } from 'vitest';
import { magneticForceMagnitude, radius } from '../src/lib/physics/lorentz';

describe('magneticForceMagnitude', () => {
  it('is |q|·v·B when v is perpendicular to B (default 90°)', () => {
    expect(magneticForceMagnitude(1, 2, 3)).toBeCloseTo(6, 12);
    expect(magneticForceMagnitude(1, 2, 3, 90)).toBeCloseTo(6, 12);
  });

  it('uses the magnitude of the charge, so sign does not matter', () => {
    expect(magneticForceMagnitude(-1, 2, 3)).toBeCloseTo(6, 12);
  });

  it('scales linearly with speed', () => {
    const base = magneticForceMagnitude(1, 2, 3);
    expect(magneticForceMagnitude(1, 4, 3)).toBeCloseTo(base * 2, 12);
  });

  it('scales linearly with field strength', () => {
    const base = magneticForceMagnitude(1, 2, 3);
    expect(magneticForceMagnitude(1, 2, 6)).toBeCloseTo(base * 2, 12);
  });

  it('is zero when v is parallel to B (angle 0°)', () => {
    expect(magneticForceMagnitude(1, 2, 3, 0)).toBeCloseTo(0, 12);
  });

  it('throws on negative speed or field', () => {
    expect(() => magneticForceMagnitude(1, -2, 3)).toThrow(RangeError);
    expect(() => magneticForceMagnitude(1, 2, -3)).toThrow(RangeError);
  });
});

describe('radius', () => {
  it('is m·v / (|q|·B)', () => {
    expect(radius(1, 1, 2, 1)).toBeCloseTo(2, 12);
  });

  it('uses the magnitude of the charge, so sign does not matter', () => {
    expect(radius(1, -1, 2, 1)).toBeCloseTo(2, 12);
  });

  it('grows with speed', () => {
    expect(radius(1, 1, 4, 1)).toBeCloseTo(radius(1, 1, 2, 1) * 2, 12);
  });

  it('shrinks as the field strengthens', () => {
    expect(radius(1, 1, 2, 2)).toBeCloseTo(radius(1, 1, 2, 1) / 2, 12);
  });

  it('throws on non-positive mass, zero charge, or non-positive field', () => {
    expect(() => radius(0, 1, 2, 1)).toThrow(RangeError);
    expect(() => radius(-1, 1, 2, 1)).toThrow(RangeError);
    expect(() => radius(1, 0, 2, 1)).toThrow(RangeError);
    expect(() => radius(1, 1, 2, 0)).toThrow(RangeError);
    expect(() => radius(1, 1, 2, -1)).toThrow(RangeError);
  });
});
