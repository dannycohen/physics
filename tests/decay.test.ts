import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { meanLifetime, remainingFraction } from '../src/lib/physics/decay';

const contentPath = new URL(
  '../src/content/viz/foundations/exponential-decay.mdx',
  import.meta.url,
);
const componentPath = new URL('../src/components/viz/DecayCurve.astro', import.meta.url);

describe('remainingFraction', () => {
  const h = 10;

  it('is 1 at t = 0', () => {
    expect(remainingFraction(0, h)).toBe(1);
  });

  it('is 1/2 after one half-life', () => {
    expect(remainingFraction(h, h)).toBe(0.5);
  });

  it('is 1/4 after two half-lives', () => {
    expect(remainingFraction(2 * h, h)).toBe(0.25);
  });

  it('is 1/e after one mean lifetime', () => {
    expect(remainingFraction(meanLifetime(h), h)).toBeCloseTo(1 / Math.E, 12);
    expect(remainingFraction(meanLifetime(h), h)).toBeCloseTo(0.3679, 4);
  });

  it('is strictly monotonic decreasing over the window', () => {
    let prev = remainingFraction(0, h);
    for (let i = 1; i <= 200; i++) {
      const next = remainingFraction((i / 200) * 60, h);
      expect(next).toBeLessThan(prev);
      prev = next;
    }
  });

  it('throws RangeError for a non-positive half-life', () => {
    expect(() => remainingFraction(1, 0)).toThrow(RangeError);
    expect(() => remainingFraction(1, -5)).toThrow(RangeError);
  });
});

describe('meanLifetime', () => {
  it('is halfLife / ln2', () => {
    expect(meanLifetime(10)).toBeCloseTo(10 / Math.LN2, 12);
  });

  it('is longer than the half-life', () => {
    for (const h of [1, 10, 25, 30]) {
      expect(meanLifetime(h)).toBeGreaterThan(h);
    }
  });
});

describe('finite-sample interpretation', () => {
  it('distinguishes expected fractions from random integer counts throughout the page', async () => {
    const [content, component] = await Promise.all([
      readFile(contentPath, 'utf8'),
      readFile(componentPath, 'utf8'),
    ]);

    expect(content).toContain('expected population keeps halving without reaching zero');
    expect(content).toContain('its final atom\neventually decays with probability one');
    expect(content).toContain('Those are expected fractions, not guaranteed integer counts.');
    expect(component).toContain('Graph of the expected fraction remaining against time.');
    expect(component).toContain('Expected fraction remaining over time');
    expect(content).not.toContain('the total never reaches zero');
    expect(content).not.toContain('always leaving a little behind');
  });
});
