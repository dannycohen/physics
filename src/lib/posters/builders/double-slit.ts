import { DEFAULT_BOX, makeScale, sampleCurve, polyline, areaUnderCurve, dot, axes, paint, type Pt } from '../../svgPoster';
import { maximaAngleDeg, highestOrder } from '../../physics/doubleslit';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;
const DEG = Math.PI / 180;

// Two-slit interference intensity across the screen, plotted against sin θ:
//   I = cos²(π · (d/λ) · sinθ)
// giving evenly spaced bright fringes. The peak positions are pinned to the
// real maximaAngleDeg for each existing order, with dots at those maxima.
const build: PosterBuilder = (entry) => {
  const wavelengthNm = 500;
  const slitSpacingNm = 2000; // d/λ = 4
  const ratio = slitSpacingNm / wavelengthNm;
  const orders = highestOrder(wavelengthNm, slitSpacingNm);

  const uMax = 0.9;
  const intensity = (u: number) => Math.pow(Math.cos(Math.PI * ratio * u), 2);
  const s = makeScale(box, -uMax, uMax, 0, 1.08);
  const pts = sampleCurve(intensity, -uMax, uMax, 256);

  // Fringe maxima at sin θ_m from the real angle function, mirrored either side.
  const peaks: Pt[] = [];
  for (let m = 0; m <= orders; m++) {
    const ang = maximaAngleDeg(m, wavelengthNm, slitSpacingNm);
    if (ang === null) continue;
    const u = Math.sin(ang * DEG);
    if (u > uMax) continue;
    peaks.push([u, 1]);
    if (m > 0) peaks.push([-u, 1]);
  }

  const body =
    axes(box, paint.axis) +
    areaUnderCurve(pts, s, 0, paint.fill) +
    polyline(pts, s, paint.curve) +
    peaks.map((p) => dot(p, s, 2.2, paint.accentDot)).join('');
  return {
    body,
    desc: `${entry.data.claim} Drawn as an interference pattern of evenly spaced bright fringes from two slits.`,
  };
};

export default build;
