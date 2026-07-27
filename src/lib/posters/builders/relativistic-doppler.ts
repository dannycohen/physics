import { DEFAULT_BOX, makeScale, sampleCurve, polyline, line, dot, axes, paint } from '../../svgPoster';
import { dopplerFactor } from '../../physics/doppler';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Relativistic Doppler factor vs beta over [-0.8, 0.8]: below one (redshift)
// when receding, above one (blueshift) when approaching, crossing exactly one
// at rest. A dashed reference marks the y = 1 crossing.
const build: PosterBuilder = (entry) => {
  const bMin = -0.8;
  const bMax = 0.8;
  const yMax = dopplerFactor(bMax); // 3
  const pts = sampleCurve((b) => dopplerFactor(b), bMin, bMax, 64);
  const s = makeScale(box, bMin, bMax, 0, yMax);
  const body =
    axes(box, paint.axis) +
    line([bMin, 1], [bMax, 1], s, paint.reference) +
    polyline(pts, s, paint.curve) +
    dot([0, 1], s, 2.4, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as the observed-frequency ratio, below one when receding and above one when approaching, crossing one at rest.`,
  };
};

export default build;
