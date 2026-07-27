import { DEFAULT_BOX, makeScale, circle, line, dot, paint, type Pt } from '../../svgPoster';
import { radius } from '../../physics/lorentz';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Lorentz force scene: the magnetic force is always perpendicular to v, so it
// does no work and only steers, curving the charge onto a closed circle whose
// radius is r = m v / (|q| B). Chosen so the real radius() lands at 32 box units.
// A sparse field of dots suggests B pointing out of the page (arrow tips).
const build: PosterBuilder = (entry) => {
  const id = makeScale(box, 0, box.w, box.h, 0); // identity: data == box coords
  const cx = 80;
  const cy = 50;
  const r = radius(1, 1, 32, 1); // m v / (|q| B) = 32

  // Sparse B-out-of-page field: dot grid, thinned near the orbit and the charge.
  const field: string[] = [];
  const charge: Pt = [cx, cy - r]; // top of the circle
  for (let gx = box.pad + 6; gx <= box.w - box.pad - 6; gx += 20) {
    for (let gy = box.pad + 6; gy <= box.h - box.pad - 6; gy += 20) {
      const dRing = Math.abs(Math.hypot(gx - cx, gy - cy) - r);
      if (dRing < 7) continue; // keep the ring readable
      if (Math.hypot(gx - charge[0], gy - charge[1]) < 12) continue;
      field.push(dot([gx, gy], id, 1.3, 'fill: var(--viz-axis); opacity: 0.6;'));
    }
  }

  // Tangential velocity arrow at the charge (top of ring), pointing along +x.
  const tip: Pt = [charge[0] + 16, charge[1]];
  const arrow =
    line(charge, tip, id, 'stroke: var(--viz-active); stroke-width: 1.5; stroke-linecap: round;') +
    line(tip, [tip[0] - 4, tip[1] - 3], id, 'stroke: var(--viz-active); stroke-width: 1.5; stroke-linecap: round;') +
    line(tip, [tip[0] - 4, tip[1] + 3], id, 'stroke: var(--viz-active); stroke-width: 1.5; stroke-linecap: round;');

  const body =
    field.join('') +
    circle([cx, cy], r, id, 'stroke: var(--glyph-accent); fill: none; stroke-width: 2.4;') +
    arrow +
    dot(charge, id, 4.5, paint.activeDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as a charge looping on a circular path, steered by a magnetic field pointing out of the page.`,
  };
};

export default build;
