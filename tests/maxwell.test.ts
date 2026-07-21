import { describe, expect, it } from 'vitest';
import { DALTON } from '../src/lib/physics/constants';
import {
  meanSpeed,
  mostProbableSpeed,
  rmsSpeed,
  speedDistribution,
} from '../src/lib/physics/maxwell';

const N2 = 28.0134 * DALTON; // nitrogen molecule mass, kg

describe('characteristic speeds', () => {
  it('orders most probable < mean < rms', () => {
    const vp = mostProbableSpeed(N2, 300);
    const vbar = meanSpeed(N2, 300);
    const vrms = rmsSpeed(N2, 300);
    expect(vp).toBeLessThan(vbar);
    expect(vbar).toBeLessThan(vrms);
  });

  it('matches the known analytic ratios (independent of gas and temperature)', () => {
    const vp = mostProbableSpeed(N2, 300);
    // v_mean / v_p = sqrt(4/pi), v_rms / v_p = sqrt(3/2)
    expect(meanSpeed(N2, 300) / vp).toBeCloseTo(Math.sqrt(4 / Math.PI), 6);
    expect(rmsSpeed(N2, 300) / vp).toBeCloseTo(Math.sqrt(3 / 2), 6);
  });

  it('gives ~517 m/s rms for nitrogen at room temperature', () => {
    expect(rmsSpeed(N2, 300)).toBeCloseTo(517, 0);
  });

  it('scales speed with sqrt(T)', () => {
    expect(rmsSpeed(N2, 1200) / rmsSpeed(N2, 300)).toBeCloseTo(2, 6);
  });

  it('throws on non-positive mass or temperature', () => {
    expect(() => mostProbableSpeed(0, 300)).toThrow(RangeError);
    expect(() => rmsSpeed(N2, 0)).toThrow(RangeError);
    expect(() => meanSpeed(-1, 300)).toThrow(RangeError);
  });
});

describe('speed distribution', () => {
  it('is zero at and below zero speed', () => {
    expect(speedDistribution(0, N2, 300)).toBe(0);
    expect(speedDistribution(-5, N2, 300)).toBe(0);
  });

  it('peaks at the most probable speed', () => {
    const vp = mostProbableSpeed(N2, 300);
    const atPeak = speedDistribution(vp, N2, 300);
    expect(atPeak).toBeGreaterThan(speedDistribution(vp * 0.9, N2, 300));
    expect(atPeak).toBeGreaterThan(speedDistribution(vp * 1.1, N2, 300));
  });

  it('integrates to 1 over all speeds', () => {
    const vp = mostProbableSpeed(N2, 300);
    const hi = 8 * vp;
    const n = 20_000;
    const dx = hi / n;
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      const weight = i === 0 || i === n ? 0.5 : 1;
      sum += weight * speedDistribution(i * dx, N2, 300);
    }
    expect(sum * dx).toBeCloseTo(1, 2);
  });

  it('throws on non-positive temperature', () => {
    expect(() => speedDistribution(400, N2, 0)).toThrow(RangeError);
  });
});
