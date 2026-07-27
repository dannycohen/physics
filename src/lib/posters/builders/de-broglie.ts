import { DEFAULT_BOX, makeScale, sampleCurve, polyline, paint } from '../../svgPoster';
import { deBroglieWavelength } from '../../physics/debroglie';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// de Broglie matter waves as two stacked sine trains. The same electron at speed
// v (top) and 3v (bottom): lambda = h/(m*v), so tripling the speed thirds the
// wavelength. The real ratio drives how many cycles the bottom train packs in.
const build: PosterBuilder = (entry) => {
  const m = 9.11e-31; // electron
  const v = 1e6;
  const lambdaSlow = deBroglieWavelength(m, v);
  const lambdaFast = deBroglieWavelength(m, 3 * v);
  const topCycles = 2;
  const bottomCycles = topCycles * (lambdaSlow / lambdaFast); // = 6, the real shrink

  const amp = 0.15;
  const twoPi = 2 * Math.PI;
  const topWave = (x: number) => 0.72 + amp * Math.sin(twoPi * topCycles * x);
  const bottomWave = (x: number) => 0.28 + amp * Math.sin(twoPi * bottomCycles * x);

  const s = makeScale(box, 0, 1, 0, 1);
  const top = sampleCurve(topWave, 0, 1, 96);
  const bottom = sampleCurve(bottomWave, 0, 1, 128);

  const body =
    polyline(top, s, 'stroke: var(--viz-rest); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;') +
    polyline(bottom, s, paint.curve);
  return {
    body,
    desc: `${entry.data.claim} Drawn as two matter waves, the faster, heavier particle carrying the shorter wavelength.`,
  };
};

export default build;
