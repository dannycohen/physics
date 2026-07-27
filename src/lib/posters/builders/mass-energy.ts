import { identityScale, line, paint, type Pt } from '../../svgPoster';
import { totalEnergy, momentumEnergy } from '../../physics/relativity';
import type { PosterBuilder } from '../types';

// The energy right-triangle E^2 = (pc)^2 + (mc^2)^2, drawn at beta=0.8 in units
// of the rest energy: horizontal leg = rest energy mc^2 (neutral), vertical leg
// = pc = momentumEnergy (warm), hypotenuse = total energy E = totalEnergy
// (accent). A small square marks the right angle at their junction.
const build: PosterBuilder = (entry) => {
  const beta = 0.8;
  const E0 = 1;
  const pc = momentumEnergy(E0, beta); // ~1.33
  const E = totalEnergy(E0, beta); // ~1.67
  const hypPx = 80; // fix the hypotenuse (total energy) length; scale legs to it
  const k = hypPx / E; // px per rest-energy unit (~48)

  const id = identityScale;
  const a: Pt = [50, 84]; // right-angle vertex
  const b: Pt = [a[0] + E0 * k, a[1]]; // end of rest-energy leg
  const c: Pt = [a[0], a[1] - pc * k]; // end of momentum leg

  const restLeg = 'stroke: var(--viz-rest); stroke-width: 1.5; stroke-linecap: round;';
  const momLeg = 'stroke: var(--viz-active); stroke-width: 1.5; stroke-linecap: round;';

  // Right-angle marker: small square nested in the corner at a.
  const m = 7;
  const rightAngle =
    line([a[0] + m, a[1]], [a[0] + m, a[1] - m], id, paint.axis) +
    line([a[0], a[1] - m], [a[0] + m, a[1] - m], id, paint.axis);

  const body =
    line(a, b, id, restLeg) +
    line(a, c, id, momLeg) +
    rightAngle +
    line(b, c, id, paint.curve);
  return {
    body,
    desc: `${entry.data.claim} Drawn as a right triangle whose hypotenuse, the total energy, is built from the rest-energy and momentum legs.`,
  };
};

export default build;
