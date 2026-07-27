import { DEFAULT_BOX, makeScale, sampleCurve, polyline, line, dot, paint } from '../../svgPoster';
import { range, maxHeight } from '../../physics/projectile';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Projectile range: a symmetric parabolic arc over level ground at the 45-degree
// launch that maximises distance. Width is the real range(v, 45) and height the
// real maxHeight(v, 45); both are rescaled to fill the box, and the arc is the
// exact symmetric parabola through launch, apex and landing.
const build: PosterBuilder = (entry) => {
  const v = 20;
  const R = range(v, 45);
  const H = maxHeight(v, 45);
  // y(x) = H * (1 - (2x/R - 1)^2): the symmetric trajectory over [0, R].
  const pts = sampleCurve((x) => H * (1 - (2 * x / R - 1) ** 2), 0, R, 64);
  const s = makeScale(box, 0, R, 0, H * 1.1);
  const body =
    line([0, 0], [R, 0], s, paint.axis) +
    polyline(pts, s, paint.curve) +
    dot([0, 0], s, 2.6, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as a projectile's parabolic arc, widest range near 45 degrees.`,
  };
};

export default build;
