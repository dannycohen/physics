import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BOX,
  makeScale,
  sampleCurve,
  polyline,
  areaUnderCurve,
} from '../src/lib/svgPoster';

describe('makeScale', () => {
  const box = DEFAULT_BOX;
  const s = makeScale(box, 0, 10, 0, 1);

  it('maps the x domain start to the left padding edge', () => {
    expect(s.x(0)).toBeCloseTo(box.pad, 6);
  });

  it('maps the x domain end to the right padding edge', () => {
    expect(s.x(10)).toBeCloseTo(box.w - box.pad, 6);
  });

  it('flips y: the domain minimum sits at the bottom, the maximum at the top', () => {
    expect(s.y(0)).toBeCloseTo(box.h - box.pad, 6);
    expect(s.y(1)).toBeCloseTo(box.pad, 6);
  });
});

describe('sampleCurve', () => {
  it('returns count+1 points spanning the closed interval', () => {
    const pts = sampleCurve((x) => x, 0, 4, 4);
    expect(pts).toHaveLength(5);
    expect(pts[0]).toEqual([0, 0]);
    expect(pts[4]).toEqual([4, 4]);
  });
});

describe('svg emitters', () => {
  const box = DEFAULT_BOX;
  const s = makeScale(box, 0, 1, 0, 1);
  const pts = sampleCurve((x) => x, 0, 1, 2);

  it('polyline is an unfilled path starting with a move command', () => {
    const out = polyline(pts, s, 'stroke: red;');
    expect(out).toContain('fill="none"');
    expect(out).toContain('d="M');
    expect(out).toContain('style="stroke: red;"');
  });

  it('areaUnderCurve closes the path back to the baseline', () => {
    const out = areaUnderCurve(pts, s, 0, 'fill: red;');
    expect(out).toContain('Z');
    expect(out).toContain('stroke="none"');
  });

  it('geometry contains no CSS variables (paint only lives in style)', () => {
    const out = polyline(pts, s, 'stroke: var(--glyph-accent);');
    const dAttr = out.match(/d="([^"]*)"/)?.[1] ?? '';
    expect(dAttr).not.toContain('var(');
  });
});
