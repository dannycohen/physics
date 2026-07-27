import { DEFAULT_BOX, makeScale, sampleCurve, polyline, areaUnderCurve, dot, axes, paint } from '../../svgPoster';
import { speedDistribution, mostProbableSpeed } from '../../physics/maxwell';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Maxwell-Boltzmann speed distribution: rises from zero, peaks at the most
// probable speed, drags a long fast tail. Mass/temperature are arbitrary
// positives - only the SHAPE matters, and it is temperature-independent once
// rescaled to the peak.
const build: PosterBuilder = (entry) => {
  const m = 4.65e-26; // ~N2 molecule
  const T = 300;
  const vp = mostProbableSpeed(m, T);
  const vMax = 3.2 * vp;
  const peak = speedDistribution(vp, m, T);
  const pts = sampleCurve((v) => speedDistribution(v, m, T), 0, vMax, 64);
  const s = makeScale(box, 0, vMax, 0, peak * 1.1);
  const body =
    axes(box, paint.axis) +
    areaUnderCurve(pts, s, 0, paint.fill) +
    polyline(pts, s, paint.curve) +
    dot([vp, peak], s, 2.2, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as a distribution rising from zero to a peak at the most probable speed, then trailing into a long high-speed tail.`,
  };
};

export default build;
