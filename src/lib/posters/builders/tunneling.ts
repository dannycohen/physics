import { sampleCurve, polyline, rect, identityScale, type Pt } from '../../svgPoster';
import { transmission } from '../../physics/tunneling';
import type { PosterBuilder } from '../types';

// Quantum tunnelling: a wave arrives at full amplitude from the left, decays
// exponentially through a barrier (limit-tinted rectangle), and leaves with a
// small amplitude on the right. The transmitted amplitude is driven by the real
// T = transmission(5, 10, 0.3) with E < V0; because that T is a fraction of a
// percent, its display amplitude is a monotonic remap (T^0.25) so it stays
// visible while still shrinking with the true transmission.
const build: PosterBuilder = (entry) => {
  const id = identityScale;
  const T = transmission(5, 10, 0.3);

  const midY = 50;
  const fullAmp = 11;
  const transAmp = fullAmp * Math.pow(T, 0.25);

  const x0 = 12; // wave start
  const bx0 = 62; // barrier left
  const bx1 = 100; // barrier right
  const x1 = 148; // wave end
  const k = 0.42; // spatial frequency
  const decay = Math.log(fullAmp / transAmp) / (bx1 - bx0);

  const amp = (x: number) => {
    if (x < bx0) return fullAmp;
    if (x <= bx1) return fullAmp * Math.exp(-decay * (x - bx0));
    return transAmp;
  };
  const wave = sampleCurve((x) => midY - amp(x) * Math.sin(k * (x - x0)), x0, x1, 160);

  const barrier = rect([bx0, 14] as Pt, [bx1, 86] as Pt, id, 'fill: var(--viz-limit); opacity: 0.14;');

  const body = barrier + polyline(wave, id, 'stroke: var(--glyph-accent); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round;');
  return {
    body,
    desc: `${entry.data.claim} Drawn as a wave striking a barrier, decaying inside it, and emerging with a small amplitude on the far side.`,
  };
};

export default build;
