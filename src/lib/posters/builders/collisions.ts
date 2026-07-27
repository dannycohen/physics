import { DEFAULT_BOX, makeScale, line, dot, paint, type Pt } from '../../svgPoster';
import { finalVelocities } from '../../physics/collision';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Elastic head-on collision of equal masses: momentum transfers completely, so
// the incoming body stops and the struck body leaves at the incoming speed.
// Top row is BEFORE, bottom row is AFTER; arrow lengths come from the real
// finalVelocities(1, 1, 2, 0, 1) = { v1: 0, v2: 2 } (the velocity swap).
const build: PosterBuilder = (entry) => {
  const id = makeScale(box, 0, box.w, box.h, 0); // data == box coords
  const u1 = 2;
  const u2 = 0;
  const { v1, v2 } = finalVelocities(1, 1, u1, u2, 1);

  const leftX = 52;
  const rightX = 108;
  const beforeY = 34;
  const afterY = 70;
  const r = 9;
  const k = 13; // box units per unit speed

  // Horizontal velocity arrow: shaft plus two barbs at the head.
  const arrow = (tail: Pt, head: Pt): string => {
    const dir = head[0] > tail[0] ? 1 : -1;
    const style = 'stroke: var(--viz-active); stroke-width: 1.6; stroke-linecap: round;';
    return (
      line(tail, head, id, style) +
      line(head, [head[0] - dir * 4, head[1] - 3], id, style) +
      line(head, [head[0] - dir * 4, head[1] + 3], id, style)
    );
  };

  const track =
    line([16, beforeY], [148, beforeY], id, paint.axis) +
    line([16, afterY], [148, afterY], id, paint.axis);

  // Before: left mass moves right into the collision (u1 > 0), right mass at rest.
  const before =
    arrow([leftX - r - k * u1, beforeY], [leftX - r - 2, beforeY]) +
    dot([leftX, beforeY], id, r, paint.accentDot) +
    dot([rightX, beforeY], id, r, paint.restDot);

  // After: left mass stops (v1 = 0, so its arrow vanishes), right mass leaves to
  // the right at v2. Each arrow's presence and length is driven by the real speed.
  const leftAfterArrow =
    v1 !== 0 ? arrow([leftX - r - 2 - k * Math.abs(v1), afterY], [leftX - r - 2, afterY]) : '';
  const after =
    leftAfterArrow +
    dot([leftX, afterY], id, r, paint.accentDot) +
    dot([rightX, afterY], id, r, paint.restDot) +
    arrow([rightX + r + 2, afterY], [rightX + r + 2 + k * v2, afterY]);

  const body = track + before + after;
  return {
    body,
    desc: `${entry.data.claim} Drawn as two masses exchanging momentum in a collision, velocities set by their masses and restitution.`,
  };
};

export default build;
