import { DEFAULT_BOX, makeScale, sampleCurve, polyline, line, dot, axes, paint } from '../../svgPoster';
import { lorentzFactor } from '../../physics/relativity';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Lorentz factor gamma vs beta over [0, 0.985], staged around the divergence:
// hugging one at low speed, then blowing up toward infinity as beta approaches
// light speed. A dashed vertical asymptote sits near beta = 1 and a dashed
// horizontal line marks the classical gamma = 1 floor.
const build: PosterBuilder = (entry) => {
  const bMax = 0.985;
  const yMax = lorentzFactor(bMax); // ~5.8
  const pts = sampleCurve((b) => lorentzFactor(b), 0, bMax, 96);
  const s = makeScale(box, 0, 1, 1, yMax);
  const body =
    axes(box, paint.axis) +
    line([0, 1], [1, 1], s, paint.reference) +
    line([0.99, 1], [0.99, yMax], s, paint.reference) +
    polyline(pts, s, paint.curve) +
    dot([0, 1], s, 2.4, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as the Lorentz factor, near one at low speed and diverging toward infinity as speed approaches light.`,
  };
};

export default build;
