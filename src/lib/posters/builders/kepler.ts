import { DEFAULT_BOX, makeScale, ellipse, dot, paint, type Pt } from '../../svgPoster';
import { orbitalPeriodYears } from '../../physics/kepler';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Kepler's laws: a planet traces an ellipse with the sun at one focus (first
// law), and the orbital period is fixed by the orbit size (third law). The focus
// is offset from the centre by c = sqrt(rx^2 - ry^2). The planet is placed at the
// point it reaches after a fixed absolute time, an angle driven by the real
// orbitalPeriodYears() so a larger orbit (longer period) advances it less.
const build: PosterBuilder = (entry) => {
  const id = makeScale(box, 0, box.w, box.h, 0); // data == box coords
  const cx = 80;
  const cy = 50;
  const rx = 54;
  const ry = 32;
  const c = Math.sqrt(rx * rx - ry * ry);
  const focus: Pt = [cx - c, cy]; // the sun at the left focus

  const aAu = 1.5;
  const tYears = 0.35;
  const meanAngle = (2 * Math.PI * tYears) / orbitalPeriodYears(aAu);
  const planet: Pt = [cx + rx * Math.cos(meanAngle), cy - ry * Math.sin(meanAngle)];

  const body =
    ellipse([cx, cy], rx, ry, id, 'stroke: var(--glyph-accent); fill: none; stroke-width: 2.4;') +
    dot(focus, id, 5, paint.accentDot) +
    dot(planet, id, 3, paint.restDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as an elliptical orbit with the sun at one focus, the period fixed by the orbit size.`,
  };
};

export default build;
