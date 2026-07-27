import { DEFAULT_BOX, makeScale, sampleCurve, polyline, areaUnderCurve, axes, paint } from '../../svgPoster';
import { minMomentumSpread } from '../../physics/heisenberg';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Heisenberg bound: the minimum momentum spread dp = hbar/(2*dx) traces a
// reciprocal hyperbola against position spread dx. Everything beneath the curve
// (a smaller product than hbar/2) is forbidden, so the area below is tinted with
// the limit colour.
const build: PosterBuilder = (entry) => {
  const dxMin = 0.35;
  const dxMax = 3.5;
  const pts = sampleCurve((dx) => minMomentumSpread(dx), dxMin, dxMax, 96);
  const yMax = minMomentumSpread(dxMin) * 1.05;
  const s = makeScale(box, dxMin, dxMax, 0, yMax);

  const body =
    axes(box, paint.axis) +
    areaUnderCurve(pts, s, 0, 'fill: var(--viz-limit); opacity: 0.12;') +
    polyline(pts, s, paint.curve);
  return {
    body,
    desc: `${entry.data.claim} Drawn as a reciprocal limit curve: squeezing the position spread forces the momentum spread up, and the region beneath it is forbidden.`,
  };
};

export default build;
