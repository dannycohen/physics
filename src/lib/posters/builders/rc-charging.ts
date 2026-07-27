import { DEFAULT_BOX, makeScale, sampleCurve, polyline, line, dot, axes, paint } from '../../svgPoster';
import { chargeFraction } from '../../physics/rc';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// A charging capacitor, V/V0 = 1 - exp(-t/tau): the voltage rises fast at first
// and then saturates, approaching but never reaching the dashed asymptote at 1.
// One time constant (tau = 1) reaches 1 - 1/e (~63%), marked on the curve.
const build: PosterBuilder = (entry) => {
  const tau = 1;
  const tMax = 4;
  const pts = sampleCurve((t) => chargeFraction(t, tau), 0, tMax, 64);
  const s = makeScale(box, 0, tMax, 0, 1);
  const yTau = chargeFraction(tau, tau);
  const body =
    axes(box, paint.axis) +
    line([0, 1], [tMax, 1], s, paint.reference) +
    line([tau, 0], [tau, yTau], s, paint.grid) +
    polyline(pts, s, paint.curve) +
    dot([tau, yTau], s, 2.6, paint.activeDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as voltage rising and saturating, reaching about 63% after one time constant.`,
  };
};

export default build;
