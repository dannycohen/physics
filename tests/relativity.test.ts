import { describe, expect, it } from 'vitest';
import {
  BETA_MAX,
  betaToSliderPos,
  dilatedTime,
  lorentzFactor,
  sliderPosToBeta,
  taylorGamma2,
} from '../src/lib/physics/relativity';

describe('lorentzFactor', () => {
  it('is 1 at rest', () => {
    expect(lorentzFactor(0)).toBe(1);
  });

  it('is 1.25 at beta = 0.6', () => {
    expect(lorentzFactor(0.6)).toBeCloseTo(1.25, 12);
  });

  it('is 5/3 at beta = 0.8', () => {
    expect(lorentzFactor(0.8)).toBeCloseTo(5 / 3, 12);
  });

  it('throws RangeError outside [0, 1)', () => {
    expect(() => lorentzFactor(1)).toThrow(RangeError);
    expect(() => lorentzFactor(-0.1)).toThrow(RangeError);
    expect(() => lorentzFactor(1.5)).toThrow(RangeError);
  });

  it('throws RangeError for NaN', () => {
    expect(() => lorentzFactor(NaN)).toThrow(RangeError);
  });
});

describe('dilatedTime', () => {
  it('dilates 1 s by gamma = 1.25 at beta = 0.6', () => {
    expect(dilatedTime(1, 0.6)).toBeCloseTo(1.25, 12);
  });

  it('is identity at beta = 0', () => {
    expect(dilatedTime(3.5, 0)).toBe(3.5);
  });
});

describe('sliderPosToBeta', () => {
  it('maps endpoints and the breakpoint', () => {
    expect(sliderPosToBeta(0)).toBe(0);
    expect(sliderPosToBeta(0.7)).toBeCloseTo(0.9, 12);
    expect(sliderPosToBeta(1)).toBeCloseTo(BETA_MAX, 12);
  });

  it('is strictly monotonic over 200 sampled points', () => {
    let prev = sliderPosToBeta(0);
    for (let i = 1; i <= 200; i++) {
      const next = sliderPosToBeta(i / 200);
      expect(next).toBeGreaterThan(prev);
      prev = next;
    }
  });

  it('is continuous across the breakpoint', () => {
    const eps = 1e-9;
    expect(sliderPosToBeta(0.7 + eps)).toBeCloseTo(sliderPosToBeta(0.7), 7);
  });
});

describe('betaToSliderPos', () => {
  it('round-trips sliderPosToBeta for 50 points', () => {
    for (let i = 0; i <= 50; i++) {
      const pos = i / 50;
      expect(betaToSliderPos(sliderPosToBeta(pos))).toBeCloseTo(pos, 10);
    }
  });

  it('maps the anchor betas back', () => {
    expect(betaToSliderPos(0)).toBe(0);
    expect(betaToSliderPos(0.9)).toBeCloseTo(0.7, 12);
    expect(betaToSliderPos(BETA_MAX)).toBeCloseTo(1, 12);
  });
});

describe('taylorGamma2', () => {
  it('is exactly 1 + beta^2/2', () => {
    expect(taylorGamma2(0.2)).toBe(1.02);
    expect(taylorGamma2(0)).toBe(1);
  });
});
