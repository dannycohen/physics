import { identityScale, circle, dot, paint, type Pt } from '../../svgPoster';
import { observedFrequency } from '../../physics/acoustic-doppler';
import type { PosterBuilder } from '../types';

// Acoustic Doppler as a scene: concentric wavefronts emitted by a source moving
// to the right. Each older ring keeps its emission centre, so rings bunch ahead
// of the source and stretch out behind. The forward and backward wavelengths
// come straight from observedFrequency (approaching vs receding).
const build: PosterBuilder = (entry) => {
  const id = identityScale; // data == box coords
  const f = 1;
  const v = 1;
  const vs = 0.5; // subsonic source speed

  // λ = v / f'. Ahead = source approaching (+vs), behind = receding (-vs).
  const scale = 20;
  const aheadWave = (v / observedFrequency(f, vs, v)) * scale; // (v - vs)/f
  const behindWave = (v / observedFrequency(f, -vs, v)) * scale; // (v + vs)/f
  const ringStep = (aheadWave + behindWave) / 2; // ∝ v: radius growth per age step
  const centreShift = (behindWave - aheadWave) / 2; // ∝ vs: centre drift per age step

  const sx = 96;
  const sy = 50;
  const rings = 5;
  let ringMarkup = '';
  for (let k = 1; k <= rings; k++) {
    const centre: Pt = [sx - k * centreShift, sy];
    const r = k * ringStep;
    const op = (0.75 - 0.08 * k).toFixed(2);
    ringMarkup += circle(
      centre,
      r,
      id,
      `stroke: var(--glyph-accent); fill: none; stroke-width: 1.3; opacity: ${op};`,
    );
  }

  const body = ringMarkup + dot([sx, sy], id, 3.4, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as sound wavefronts bunched ahead of a moving source and stretched behind it.`,
  };
};

export default build;
