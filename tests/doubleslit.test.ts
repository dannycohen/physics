import { describe, expect, it } from 'vitest';
import { highestOrder, maximaAngleDeg } from '../src/lib/physics/doubleslit';

describe('maximaAngleDeg', () => {
  it('puts the zeroth order straight ahead at 0°', () => {
    expect(maximaAngleDeg(0, 550, 2500)).toBe(0);
    expect(maximaAngleDeg(0, 700, 1200)).toBe(0);
  });

  it('gives the first-order angle from sin θ = λ/d', () => {
    // λ = 500 nm, d = 2000 nm → sin θ = 0.25 → θ ≈ 14.48°
    expect(maximaAngleDeg(1, 500, 2000)).toBeCloseTo(14.4775, 3);
  });

  it('returns null when the order does not fit (m·λ > d)', () => {
    // order 5: 5 · 500 / 2000 = 1.25 > 1 → no such fringe
    expect(maximaAngleDeg(5, 500, 2000)).toBeNull();
  });

  it('reaches 90° exactly when m·λ = d', () => {
    expect(maximaAngleDeg(4, 500, 2000)).toBeCloseTo(90, 6);
  });

  it('throws on a non-integer or negative order', () => {
    expect(() => maximaAngleDeg(1.5, 500, 2000)).toThrow(RangeError);
    expect(() => maximaAngleDeg(-1, 500, 2000)).toThrow(RangeError);
  });

  it('throws on non-positive wavelength or spacing', () => {
    expect(() => maximaAngleDeg(1, 0, 2000)).toThrow(RangeError);
    expect(() => maximaAngleDeg(1, 500, 0)).toThrow(RangeError);
    expect(() => maximaAngleDeg(1, -500, 2000)).toThrow(RangeError);
  });
});

describe('highestOrder', () => {
  it('counts floor(d/λ) bright orders on each side', () => {
    expect(highestOrder(500, 2000)).toBe(4);
    expect(highestOrder(550, 2500)).toBe(4);
    expect(highestOrder(700, 1200)).toBe(1);
  });

  it('agrees with maximaAngleDeg on which orders exist', () => {
    const n = highestOrder(550, 2500);
    expect(maximaAngleDeg(n, 550, 2500)).not.toBeNull();
    expect(maximaAngleDeg(n + 1, 550, 2500)).toBeNull();
  });

  it('throws on non-positive wavelength or spacing', () => {
    expect(() => highestOrder(0, 2000)).toThrow(RangeError);
    expect(() => highestOrder(500, -1)).toThrow(RangeError);
  });
});
