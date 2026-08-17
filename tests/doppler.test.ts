import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { dopplerFactor, observedFrequency } from '../src/lib/physics/doppler';

const contentPath = new URL(
  '../src/content/viz/relativity/relativistic-doppler.mdx',
  import.meta.url,
);
const componentPath = new URL('../src/components/viz/DopplerShift.astro', import.meta.url);
const modulePath = new URL('../src/lib/physics/doppler.ts', import.meta.url);

describe('dopplerFactor', () => {
  it('is 1 at rest', () => {
    expect(dopplerFactor(0)).toBe(1);
  });

  it('is greater than 1 when approaching (blueshift)', () => {
    expect(dopplerFactor(0.6)).toBeGreaterThan(1);
  });

  it('is less than 1 when receding (redshift)', () => {
    expect(dopplerFactor(-0.6)).toBeLessThan(1);
  });

  it('is 2 at beta = 0.6 and 0.5 at beta = -0.6', () => {
    expect(dopplerFactor(0.6)).toBeCloseTo(2, 12);
    expect(dopplerFactor(-0.6)).toBeCloseTo(0.5, 12);
  });

  it('is reciprocal under sign flip: f(b) * f(-b) === 1', () => {
    for (const beta of [0.1, 0.3, 0.5, 0.6, 0.9]) {
      expect(dopplerFactor(beta) * dopplerFactor(-beta)).toBeCloseTo(1, 12);
    }
  });

  it('throws RangeError at the light-speed limits and beyond', () => {
    expect(() => dopplerFactor(1)).toThrow(RangeError);
    expect(() => dopplerFactor(-1)).toThrow(RangeError);
    expect(() => dopplerFactor(1.5)).toThrow(RangeError);
  });
});

describe('observedFrequency', () => {
  it('scales the source frequency linearly by the Doppler factor', () => {
    const beta = 0.6;
    const factor = dopplerFactor(beta);
    expect(observedFrequency(100, beta)).toBeCloseTo(100 * factor, 10);
    expect(observedFrequency(500, beta)).toBeCloseTo(500 * factor, 10);
    expect(observedFrequency(500, beta)).toBeCloseTo(5 * observedFrequency(100, beta), 10);
  });

  it('leaves the source frequency unchanged at rest', () => {
    expect(observedFrequency(440, 0)).toBe(440);
  });
});

describe('Doppler model scope', () => {
  it('separates local longitudinal motion from cosmological redshift', async () => {
    const [content, component, moduleSource] = await Promise.all([
      readFile(contentPath, 'utf8'),
      readFile(componentPath, 'utf8'),
      readFile(modulePath, 'utf8'),
    ]);

    expect(content).toContain('Galaxy peculiar motion');
    expect(content).toContain("galaxy's peculiar velocity");
    expect(content).toContain('requires a cosmological model');
    expect(component).toContain('does not represent cosmological redshift from expanding space');
    expect(moduleSource).toContain('This is not a cosmological-redshift model');
    expect(content).not.toContain("read a galaxy's recession speed straight from");
  });
});
