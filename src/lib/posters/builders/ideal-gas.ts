import { DEFAULT_BOX, makeScale, sampleCurve, polyline, axes, paint } from '../../svgPoster';
import { pressure } from '../../physics/ideal-gas';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// An isotherm of the ideal gas law, PV = nRT: at fixed amount and temperature the
// pressure falls as one over the volume, tracing Boyle's 1/V hyperbola. Values
// are arbitrary positives; y is rescaled since only the SHAPE matters.
const build: PosterBuilder = (entry) => {
  const vMin = 0.01;
  const vMax = 0.06;
  const yMax = pressure(1, 300, vMin);
  const pts = sampleCurve((v) => pressure(1, 300, v), vMin, vMax, 64);
  const s = makeScale(box, vMin, vMax, 0, yMax);
  const body =
    axes(box, paint.axis) +
    polyline(pts, s, paint.curve);
  return {
    body,
    desc: `${entry.data.claim} Drawn as an isotherm - pressure falling as one over volume at fixed temperature.`,
  };
};

export default build;
