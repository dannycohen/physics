import { DEFAULT_BOX, makeScale, sampleCurve, polyline, areaUnderCurve, dot, axes, paint } from '../../svgPoster';
import { spectralRadiance, peakWavelength } from '../../physics/planck';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Planck's blackbody spectrum for the Sun (T = 5778 K). The lambda^5 term forces
// a steep short-wavelength cliff, the exponential caps a long red tail, and the
// peak sits at Wien's displacement wavelength. Only the SHAPE matters, so y is
// rescaled to the peak radiance.
const build: PosterBuilder = (entry) => {
  const T = 5778;
  const peak = peakWavelength(T);
  const peakVal = spectralRadiance(peak, T);
  const pts = sampleCurve((lambda) => spectralRadiance(lambda, T), 0.15 * peak, 4 * peak, 64);
  const s = makeScale(box, 0.15 * peak, 4 * peak, 0, peakVal * 1.1);
  const body =
    axes(box, paint.axis) +
    areaUnderCurve(pts, s, 0, paint.fill) +
    polyline(pts, s, paint.curve) +
    dot([peak, peakVal], s, 2.2, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as the blackbody spectrum, a skewed peak with a short-wavelength cliff and a long tail.`,
  };
};

export default build;
