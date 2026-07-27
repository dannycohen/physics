import { DEFAULT_BOX, makeScale, line, dot, paint, type Pt } from '../../svgPoster';
import { fieldContribution } from '../../physics/electrostatics';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Coulomb's law: two point charges with radial field-line segments sampled from
// the real field function, fading with distance as 1/r^2. A + and a - mark the
// charges with plain strokes (no text).
const build: PosterBuilder = (entry) => {
  const q1 = { x: 52, y: 50, q: 1 };
  const q2 = { x: 108, y: 50, q: -1 };
  const id = makeScale(box, 0, box.w, box.h, 0); // identity: data == box coords

  interface Sample {
    x: number;
    y: number;
    ux: number;
    uy: number;
    mag: number;
  }
  const samples: Sample[] = [];
  let maxMag = 0;
  for (let gx = box.pad + 6; gx <= box.w - box.pad - 6; gx += 16) {
    for (let gy = box.pad + 4; gy <= box.h - box.pad - 4; gy += 16) {
      if (Math.hypot(gx - q1.x, gy - q1.y) < 9 || Math.hypot(gx - q2.x, gy - q2.y) < 9) continue;
      const [f1x, f1y] = fieldContribution(q1.q, gx - q1.x, gy - q1.y);
      const [f2x, f2y] = fieldContribution(q2.q, gx - q2.x, gy - q2.y);
      const fx = f1x + f2x;
      const fy = f1y + f2y;
      const mag = Math.hypot(fx, fy);
      if (!Number.isFinite(mag) || mag === 0) continue;
      maxMag = Math.max(maxMag, mag);
      samples.push({ x: gx, y: gy, ux: fx / mag, uy: fy / mag, mag });
    }
  }

  const segs = samples
    .map((p) => {
      const len = 6;
      const a: Pt = [p.x - (p.ux * len) / 2, p.y - (p.uy * len) / 2];
      const b: Pt = [p.x + (p.ux * len) / 2, p.y + (p.uy * len) / 2];
      const op = (0.18 + 0.62 * Math.pow(p.mag / maxMag, 0.32)).toFixed(2);
      return line(a, b, id, `stroke: var(--glyph-accent); stroke-width: 1.4; opacity: ${op}; stroke-linecap: round;`);
    })
    .join('');

  const plus =
    line([q1.x - 3, q1.y], [q1.x + 3, q1.y], id, paint.mark) +
    line([q1.x, q1.y - 3], [q1.x, q1.y + 3], id, paint.mark);
  const minus = line([q2.x - 3, q2.y], [q2.x + 3, q2.y], id, paint.mark);

  const body =
    segs +
    dot([q1.x, q1.y], id, 6, paint.activeDot) +
    dot([q2.x, q2.y], id, 6, 'fill: var(--color-link);') +
    plus +
    minus;
  return {
    body,
    desc: `${entry.data.claim} Drawn as two point charges with field-line segments radiating between them, fading with distance as one over r squared.`,
  };
};

export default build;
