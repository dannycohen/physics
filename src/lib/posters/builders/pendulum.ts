import { DEFAULT_BOX, makeScale, sampleCurve, polyline, line, dot, paint } from '../../svgPoster';
import { angleAt, period } from '../../physics/pendulum';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Simple pendulum: the small-angle swing is simple harmonic motion, so the angle
// traces a cosine in time. Plotted from the real angleAt() over 1.5 periods of a
// 1 m pendulum, about a dashed zero-angle reference.
const build: PosterBuilder = (entry) => {
  const amp = 0.4;
  const lengthM = 1;
  const tMax = 1.5 * period(lengthM);
  const pts = sampleCurve((t) => angleAt(amp, lengthM, t), 0, tMax, 64);
  const s = makeScale(box, 0, tMax, -amp * 1.2, amp * 1.2);
  const body =
    line([0, 0], [tMax, 0], s, paint.reference) +
    polyline(pts, s, paint.curve) +
    dot([0, angleAt(amp, lengthM, 0)], s, 2.4, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as the angle swinging as a cosine in time, one full period set by the length.`,
  };
};

export default build;
