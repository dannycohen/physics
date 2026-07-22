import { describe, expect, it } from 'vitest';
import { criticalAngleDeg, refractionAngleDeg } from '../src/lib/physics/snell';

describe('refractionAngleDeg', () => {
  it('bends light toward the normal going air to glass', () => {
    expect(refractionAngleDeg(1, 1.5, 30)).toBeCloseTo(19.47, 2);
  });

  it('leaves the angle unchanged when the indices match', () => {
    expect(refractionAngleDeg(1.4, 1.4, 42)).toBeCloseTo(42, 6);
    expect(refractionAngleDeg(1, 1, 0)).toBeCloseTo(0, 6);
  });

  it('returns null (total internal reflection) beyond the critical angle', () => {
    expect(refractionAngleDeg(1.5, 1, 60)).toBeNull();
  });

  it('still refracts just inside the critical angle going glass to air', () => {
    expect(refractionAngleDeg(1.5, 1, 30)).toBeCloseTo(48.59, 2);
  });

  it('guards the indices and the incident-angle range', () => {
    expect(() => refractionAngleDeg(0, 1.5, 30)).toThrow(RangeError);
    expect(() => refractionAngleDeg(1, -1, 30)).toThrow(RangeError);
    expect(() => refractionAngleDeg(1, 1.5, 90)).toThrow(RangeError);
    expect(() => refractionAngleDeg(1, 1.5, -1)).toThrow(RangeError);
  });
});

describe('criticalAngleDeg', () => {
  it('gives arcsin(n2/n1) going from glass to air', () => {
    expect(criticalAngleDeg(1.5, 1)).toBeCloseTo(41.81, 2);
  });

  it('is null when the second medium is denser (no total internal reflection)', () => {
    expect(criticalAngleDeg(1, 1.5)).toBeNull();
    expect(criticalAngleDeg(1.5, 1.5)).toBeNull();
  });

  it('guards the indices', () => {
    expect(() => criticalAngleDeg(0, 1)).toThrow(RangeError);
    expect(() => criticalAngleDeg(1.5, 0)).toThrow(RangeError);
  });
});
