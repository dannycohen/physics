import { describe, expect, it } from 'vitest';
import {
  BETA_MAX,
  betaToSliderPos,
  contractedLength,
  dilatedTime,
  kineticEnergy,
  lorentzFactor,
  momentumEnergy,
  sliderPosToBeta,
  taylorGamma2,
  totalEnergy,
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

describe('contractedLength', () => {
  it('is the full rest length at rest', () => {
    expect(contractedLength(100, 0)).toBe(100);
  });

  it('is L0 / gamma (80 m at beta = 0.6, 60 m at beta = 0.8)', () => {
    expect(contractedLength(100, 0.6)).toBeCloseTo(80, 10);
    expect(contractedLength(100, 0.8)).toBeCloseTo(60, 10);
  });

  it('equals L0 * sqrt(1 - beta^2)', () => {
    for (const beta of [0.1, 0.5, 0.87, 0.99]) {
      expect(contractedLength(100, beta)).toBeCloseTo(100 * Math.sqrt(1 - beta * beta), 10);
    }
  });

  it('shrinks toward zero as beta grows', () => {
    expect(contractedLength(100, 0.999)).toBeLessThan(contractedLength(100, 0.5));
    expect(contractedLength(100, 0.999)).toBeGreaterThan(0);
  });
});

describe('relativistic energy', () => {
  it('total energy is mc^2 at rest and gamma*mc^2 moving', () => {
    expect(totalEnergy(0.511, 0)).toBe(0.511);
    expect(totalEnergy(2, 0.6)).toBeCloseTo(2.5, 10); // gamma 1.25
  });

  it('kinetic energy is (gamma - 1) mc^2', () => {
    expect(kineticEnergy(1, 0)).toBe(0);
    expect(kineticEnergy(1, 0.6)).toBeCloseTo(0.25, 10);
  });

  it('satisfies E^2 = (pc)^2 + (mc^2)^2', () => {
    const m = 0.511;
    for (const beta of [0, 0.3, 0.6, 0.87, 0.99]) {
      const e = totalEnergy(m, beta);
      const pc = momentumEnergy(m, beta);
      expect(e * e).toBeCloseTo(pc * pc + m * m, 8);
    }
  });

  it('approaches the massless limit pc/E -> beta (exactly)', () => {
    for (const beta of [0.1, 0.5, 0.999]) {
      expect(momentumEnergy(3, beta) / totalEnergy(3, beta)).toBeCloseTo(beta, 12);
    }
  });
});
