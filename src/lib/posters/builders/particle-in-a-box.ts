import { identityScale, sampleCurve, line, polyline, type Pt } from '../../svgPoster';
import { energyLevelEv } from '../../physics/particle-box';
import type { PosterBuilder } from '../types';

// Infinite square well: two hard walls with the first four energy levels drawn as
// horizontal lines. Heights come from energyLevelEv(n, m, L), so the E_n ~ n^2
// spacing is real - each gap wider than the last. A faint half-wave sits on the
// ground level.
const build: PosterBuilder = (entry) => {
  const id = identityScale;
  const m = 9.11e-31; // electron
  const L = 1e-9;
  const leftWall = 40;
  const rightWall = 120;
  const baseY = 92; // zero energy at the well floor
  const topY = 20; // where the n=4 level lands

  const energies = [1, 2, 3, 4].map((n) => energyLevelEv(n, m, L));
  const eMax = energies[energies.length - 1] as number;
  const levelY = (e: number) => baseY - (e / eMax) * (baseY - topY);

  const walls =
    line([leftWall, topY - 6] as Pt, [leftWall, baseY] as Pt, id, 'stroke: var(--viz-axis); stroke-width: 2.4; stroke-linecap: round;') +
    line([rightWall, topY - 6] as Pt, [rightWall, baseY] as Pt, id, 'stroke: var(--viz-axis); stroke-width: 2.4; stroke-linecap: round;') +
    line([leftWall, baseY] as Pt, [rightWall, baseY] as Pt, id, 'stroke: var(--viz-axis); stroke-width: 2.4; stroke-linecap: round;');

  const levels = energies
    .map((e) => {
      const y = levelY(e);
      return line([leftWall, y] as Pt, [rightWall, y] as Pt, id, 'stroke: var(--glyph-accent); stroke-width: 2; stroke-linecap: round;');
    })
    .join('');

  const groundY = levelY(energies[0] as number);
  const wave = sampleCurve(
    (x) => groundY - 5 * Math.sin((Math.PI * (x - leftWall)) / (rightWall - leftWall)),
    leftWall,
    rightWall,
    64,
  );
  const standing = polyline(wave, id, 'stroke: var(--glyph-accent); stroke-width: 1.2; opacity: 0.45;');

  const body = walls + standing + levels;
  return {
    body,
    desc: `${entry.data.claim} Drawn as quantized energy levels in a box, spaced ever wider as the square of the level number.`,
  };
};

export default build;
