import { DEFAULT_BOX, makeScale, sampleCurve, polyline, areaUnderCurve, line, dot, axes, paint } from '../../svgPoster';
import { remainingFraction } from '../../physics/decay';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Exponential decay N/N0 = 2^(-t/half-life): a falling curve with the
// characteristic 50% and 25% markers at one and two half-lives.
const build: PosterBuilder = (entry) => {
  const tMax = 4; // in half-lives
  const pts = sampleCurve((t) => remainingFraction(t, 1), 0, tMax, 64);
  const s = makeScale(box, 0, tMax, 0, 1);
  const body =
    axes(box, paint.axis) +
    line([0, 0.5], [1, 0.5], s, paint.grid) +
    areaUnderCurve(pts, s, 0, paint.fill) +
    polyline(pts, s, paint.curve) +
    dot([1, 0.5], s, 2, paint.accentDot) +
    dot([2, 0.25], s, 2, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as a curve falling by half every half-life: markers sit at 50% after one half-life and 25% after two.`,
  };
};

export default build;
