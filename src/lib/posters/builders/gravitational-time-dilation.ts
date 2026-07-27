import { DEFAULT_BOX, makeScale, sampleCurve, polyline, line, dot, axes, paint } from '../../svgPoster';
import { clockRate } from '../../physics/gravitational-dilation';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Schwarzschild clock rate sqrt(1 - r_s/r) vs r/r_s over [1.02, 8]: near zero
// just outside the horizon, climbing toward one far from the mass. A dashed
// reference marks the y = 1 asymptote.
const build: PosterBuilder = (entry) => {
  const xMin = 1.02;
  const xMax = 8;
  const pts = sampleCurve((x) => clockRate(x), xMin, xMax, 64);
  const s = makeScale(box, xMin, xMax, 0, 1.05);
  const body =
    axes(box, paint.axis) +
    line([xMin, 1], [xMax, 1], s, paint.reference) +
    polyline(pts, s, paint.curve) +
    dot([xMin, clockRate(xMin)], s, 2.4, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as the clock rate climbing from near zero at the horizon toward one far from the mass.`,
  };
};

export default build;
