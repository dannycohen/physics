// Per-equation "posters": small inline-SVG marks whose shape is drawn from the
// equation's OWN physics. The source of truth is the same pure functions the
// interactive islands call (src/lib/physics/*), so a poster can never drift from
// the live viz in the way that matters - the maths. Curve equations are plotted
// directly; spatial ones get a small hand-built scene. Each builder lives in its
// own file under ./builders (one per equation, keyed by entry id). Anything
// without a registered builder falls back to a generic per-archetype mark, so a
// new equation still ships as one MDX file and renders a valid poster.

import { DEFAULT_BOX, makeScale, sampleCurve, polyline, areaUnderCurve, line, dot, axes, paint } from '../svgPoster';
import type { VizEntry } from '../catalog';
import type { Poster, PosterBuilder } from './types';

import maxwellBoltzmann from './builders/maxwell-boltzmann';
import exponentialDecay from './builders/exponential-decay';
import timeDilation from './builders/time-dilation';
import coulomb from './builders/coulomb';
import lorentzFactor from './builders/lorentz-factor';
import lengthContraction from './builders/length-contraction';
import massEnergy from './builders/mass-energy';
import relativisticDoppler from './builders/relativistic-doppler';
import gravitationalTimeDilation from './builders/gravitational-time-dilation';
import planckBlackbody from './builders/planck-blackbody';
import idealGas from './builders/ideal-gas';
import rcCharging from './builders/rc-charging';
import lorentzForce from './builders/lorentz-force';
import deBroglie from './builders/de-broglie';
import photoelectric from './builders/photoelectric';
import particleInABox from './builders/particle-in-a-box';
import heisenberg from './builders/heisenberg';
import tunneling from './builders/tunneling';
import projectileRange from './builders/projectile-range';
import pendulum from './builders/pendulum';
import kepler from './builders/kepler';
import collisions from './builders/collisions';
import snell from './builders/snell';
import beats from './builders/beats';
import acousticDoppler from './builders/acoustic-doppler';
import doubleSlit from './builders/double-slit';

export type { Poster } from './types';

const box = DEFAULT_BOX;

const builders: Record<string, PosterBuilder> = {
  'thermodynamics/maxwell-boltzmann': maxwellBoltzmann,
  'foundations/exponential-decay': exponentialDecay,
  'relativity/time-dilation': timeDilation,
  'electromagnetism/coulomb': coulomb,
  'foundations/lorentz-factor': lorentzFactor,
  'relativity/length-contraction': lengthContraction,
  'relativity/mass-energy': massEnergy,
  'relativity/relativistic-doppler': relativisticDoppler,
  'relativity/gravitational-time-dilation': gravitationalTimeDilation,
  'thermodynamics/planck-blackbody': planckBlackbody,
  'thermodynamics/ideal-gas': idealGas,
  'electromagnetism/rc-charging': rcCharging,
  'electromagnetism/lorentz-force': lorentzForce,
  'quantum/de-broglie': deBroglie,
  'quantum/photoelectric': photoelectric,
  'quantum/particle-in-a-box': particleInABox,
  'quantum/heisenberg': heisenberg,
  'quantum/tunneling': tunneling,
  'classical-mechanics/projectile-range': projectileRange,
  'classical-mechanics/pendulum': pendulum,
  'classical-mechanics/kepler': kepler,
  'classical-mechanics/collisions': collisions,
  'waves-optics/snell': snell,
  'waves-optics/beats': beats,
  'waves-optics/acoustic-doppler': acousticDoppler,
  'waves-optics/double-slit': doubleSlit,
};

// Generic per-archetype marks: the safety net for an equation with no bespoke
// builder yet, so every card always renders something valid and correctly themed.
const archetypeFallback: Record<string, (entry: VizEntry) => Poster> = {
  distribution: (entry) => {
    const pts = sampleCurve((x) => Math.exp(-((x - 0.42) ** 2) / 0.05), 0, 1, 48);
    const s = makeScale(box, 0, 1, 0, 1);
    return {
      body: axes(box, paint.axis) + areaUnderCurve(pts, s, 0, paint.fill) + polyline(pts, s, paint.curve),
      desc: `${entry.data.claim} Shown as a single-peaked distribution.`,
    };
  },
  'time-series': (entry) => {
    const pts = sampleCurve((t) => 1 - Math.exp(-3 * t), 0, 1, 48);
    const s = makeScale(box, 0, 1, 0, 1);
    return {
      body: axes(box, paint.axis) + polyline(pts, s, paint.curve),
      desc: `${entry.data.claim} Shown as a quantity evolving over time toward a limit.`,
    };
  },
  comparison: (entry) => {
    const s = makeScale(box, 0, 1, 0, 1);
    const body =
      axes(box, paint.axis) +
      line([0.28, 0.1], [0.28, 0.85], s, 'stroke: var(--viz-rest); stroke-width: 8; stroke-linecap: round;') +
      line([0.68, 0.1], [0.68, 0.55], s, 'stroke: var(--glyph-accent); stroke-width: 8; stroke-linecap: round;');
    return { body, desc: `${entry.data.claim} Shown as two quantities compared side by side.` };
  },
  'field-space': (entry) => {
    const id = makeScale(box, 0, box.w, box.h, 0);
    const cx = box.w / 2;
    const cy = box.h / 2;
    const rings = [10, 18, 26, 34]
      .map(
        (r, i) =>
          `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" style="stroke: var(--glyph-accent); stroke-width: 1.4; opacity: ${(0.7 - i * 0.15).toFixed(2)};"/>`,
      )
      .join('');
    return {
      body: rings + dot([cx, cy], id, 3.5, paint.accentDot),
      desc: `${entry.data.claim} Shown as a field radiating through space from a source.`,
    };
  },
};

const genericFallback = (entry: VizEntry): Poster => ({
  body: axes(box, paint.axis),
  desc: entry.data.claim,
});

/** Build the poster for an entry: bespoke builder, else archetype fallback. */
export function renderPoster(entry: VizEntry): Poster {
  const bespoke = builders[entry.id];
  if (bespoke) return bespoke(entry);
  const fallback = archetypeFallback[entry.data.layoutArchetype];
  return fallback ? fallback(entry) : genericFallback(entry);
}
