import { identityScale, line, paint, type Pt } from '../../svgPoster';
import { contractedLength } from '../../physics/relativity';
import type { PosterBuilder } from '../types';

// Length contraction as two stacked bars: the top bar is the rest length L0 at
// full width (neutral), the bottom bar is the same object in motion at beta=0.8,
// shortened by L/L0 = contractedLength(1, beta) along its direction of travel.
// A dashed continuation shows the extent lost to contraction.
const build: PosterBuilder = (entry) => {
  const beta = 0.8;
  const ratio = contractedLength(1, beta); // L / L0 = sqrt(1 - beta^2) = 0.6
  const id = identityScale;

  const x0 = 16;
  const xFull = 144;
  const full = xFull - x0;
  const xShort = x0 + full * ratio;

  const restBar = 'stroke: var(--viz-rest); stroke-width: 6; stroke-linecap: round;';
  const movingBar = 'stroke: var(--glyph-accent); stroke-width: 6; stroke-linecap: round;';

  const top: [Pt, Pt] = [[x0, 38], [xFull, 38]];
  const bottom: [Pt, Pt] = [[x0, 64], [xShort, 64]];

  const body =
    line(top[0], top[1], id, restBar) +
    line([xShort, 64], [xFull, 64], id, paint.reference) +
    line(bottom[0], bottom[1], id, movingBar);
  return {
    body,
    desc: `${entry.data.claim} Drawn as two lengths compared, the moving one visibly shorter along its direction of motion.`,
  };
};

export default build;
