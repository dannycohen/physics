import { DEFAULT_BOX, identityScale, line, dot, paint, type Pt } from '../../svgPoster';
import { refractionAngleDeg } from '../../physics/snell';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;
const DEG = Math.PI / 180;

// Snell's law as a scene: a horizontal interface across the middle, an incident
// ray striking the origin at 40 deg from the normal, and the refracted ray
// continuing into the denser lower medium at the real refractionAngleDeg, bent
// toward the (dashed vertical) normal.
const build: PosterBuilder = (entry) => {
  const id = identityScale; // data == box coords
  const ox = 80;
  const oy = 50;
  const incidentDeg = 40;
  const refractedDeg = refractionAngleDeg(1, 1.5, incidentDeg) ?? incidentDeg;

  const Lin = 40;
  const start: Pt = [ox - Lin * Math.sin(incidentDeg * DEG), oy - Lin * Math.cos(incidentDeg * DEG)];
  const Lout = 40;
  const end: Pt = [ox + Lout * Math.sin(refractedDeg * DEG), oy + Lout * Math.cos(refractedDeg * DEG)];

  const body =
    line([box.pad, oy], [box.w - box.pad, oy], id, paint.axis) +
    line([ox, box.pad + 2], [ox, box.h - box.pad - 2], id, paint.reference) +
    line(start, [ox, oy], id, paint.curve) +
    line([ox, oy], end, id, paint.curve) +
    dot([ox, oy], id, 2.6, paint.accentDot);
  return {
    body,
    desc: `${entry.data.claim} Drawn as a ray bending toward the normal as it crosses the interface into a denser medium below.`,
  };
};

export default build;
