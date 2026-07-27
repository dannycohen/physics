import { DEFAULT_BOX, makeScale, sampleCurve, polyline, line, dot, axes, paint } from '../../svgPoster';
import { maxKineticEnergyEv, thresholdWavelengthNm } from '../../physics/photoelectric';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Photoelectric effect: max kinetic energy vs a frequency proxy (1/wavelength).
// Work function 2 eV. Below the threshold frequency the curve is pinned flat at
// zero (no electron escapes), then climbs linearly once each photon clears phi.
const build: PosterBuilder = (entry) => {
  const phi = 2;
  const xMin = 1 / 1200; // long wavelength -> low frequency, below threshold
  const xMax = 1 / 300; // short wavelength -> high frequency
  const xThr = 1 / thresholdWavelengthNm(phi);

  const kmax = (x: number) => maxKineticEnergyEv(1 / x, phi);
  const pts = sampleCurve(kmax, xMin, xMax, 96);
  const yMax = kmax(xMax) * 1.1;
  const s = makeScale(box, xMin, xMax, 0, yMax);

  const body =
    axes(box, paint.axis) +
    line([xThr, 0], [xThr, yMax], s, paint.reference) +
    polyline(pts, s, paint.curve) +
    dot([xThr, 0], s, 2.6, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as a flat zero below the threshold frequency, then kinetic energy rising linearly above it.`,
  };
};

export default build;
