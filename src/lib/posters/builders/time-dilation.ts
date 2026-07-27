import { DEFAULT_BOX, makeScale, sampleCurve, polyline, line, dot, axes, paint } from '../../svgPoster';
import { lorentzFactor } from '../../physics/relativity';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Time dilation via the Lorentz factor gamma vs beta: flat near 1, then a
// hockey-stick blow-up toward the speed of light, above a dashed Newtonian
// gamma = 1 reference.
const build: PosterBuilder = (entry) => {
  const bMax = 0.97;
  const yMax = lorentzFactor(bMax);
  const pts = sampleCurve((b) => lorentzFactor(b), 0, bMax, 64);
  const s = makeScale(box, 0, 1, 1, yMax);
  const body =
    axes(box, paint.axis) +
    line([0, 1], [1, 1], s, paint.reference) +
    polyline(pts, s, paint.curve) +
    dot([0, 1], s, 2, paint.restDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as the Lorentz factor: nearly flat at one for low speeds, then rising steeply toward infinity as speed approaches light, above a dashed classical reference.`,
  };
};

export default build;
