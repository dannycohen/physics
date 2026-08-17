import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { clockRate } from '../src/lib/physics/gravitational-dilation';

const contentPath = new URL(
  '../src/content/viz/relativity/gravitational-time-dilation.mdx',
  import.meta.url,
);
const componentPath = new URL('../src/components/viz/GravitationalClock.astro', import.meta.url);
const modulePath = new URL('../src/lib/physics/gravitational-dilation.ts', import.meta.url);

describe('clockRate', () => {
  it('is sqrt(0.5) ~ 0.7071 at rOverRs = 2', () => {
    expect(clockRate(2)).toBeCloseTo(Math.SQRT1_2, 12);
    expect(clockRate(2)).toBeCloseTo(0.7071, 4);
  });

  it('approaches 1 as rOverRs -> infinity', () => {
    expect(clockRate(1e6)).toBeCloseTo(1, 5);
    expect(clockRate(1e6)).toBeLessThan(1);
  });

  it('is near zero just above the horizon', () => {
    expect(clockRate(1.0001)).toBeLessThan(0.01);
    expect(clockRate(1.0001)).toBeGreaterThan(0);
  });

  it('is strictly increasing in rOverRs', () => {
    let prev = clockRate(1.01);
    for (let i = 1; i <= 200; i++) {
      const next = clockRate(1.01 + i * 0.5);
      expect(next).toBeGreaterThan(prev);
      prev = next;
    }
  });

  it('throws RangeError at and inside the horizon', () => {
    expect(() => clockRate(1)).toThrow(RangeError);
    expect(() => clockRate(0.5)).toThrow(RangeError);
  });
});

describe('Schwarzschild observer scope', () => {
  it('distinguishes stationary lapse, infall, and non-horizon bodies', async () => {
    const [content, component, moduleSource] = await Promise.all([
      readFile(contentPath, 'utf8'),
      readFile(componentPath, 'utf8'),
      readFile(modulePath, 'utf8'),
    ]);

    expect(content).toContain('outside a nonrotating,\nspherically symmetric mass');
    expect(content).toContain('An infalling observer instead crosses the\nhorizon in finite proper time');
    expect(content).toContain('r_s lies inside the body and is not an actual horizon');
    expect(component).toContain("Graph of a stationary clock's proper-time rate");
    expect(moduleSource).toContain('This function does not describe an infalling observer');
    expect(content).not.toContain('the clock freezes when r reaches r_s');
    expect(moduleSource).not.toContain('proper time is frozen');
  });
});
