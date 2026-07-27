import { DEFAULT_BOX, makeScale, sampleCurve, polyline, axes, paint } from '../../svgPoster';
import { beatFrequency, carrierFrequency } from '../../physics/beats';
import type { PosterBuilder } from '../types';

const box = DEFAULT_BOX;

// Beats: two close tones (9 and 11 cycles across the box) summed. The fast
// carrier rides at their average frequency while the amplitude swells and
// pinches at the beat rate |f1 - f2|. The crossing envelope pair is drawn
// thicker in the accent colour over the thinner summed waveform.
const build: PosterBuilder = (entry) => {
  const f1 = 9;
  const f2 = 11;
  const beat = beatFrequency(f1, f2); // 2
  const carrier = carrierFrequency(f1, f2); // 10

  // sin(2π f1 t) + sin(2π f2 t) = 2 sin(2π carrier t) cos(π beat t)
  const sum = (t: number) => 2 * Math.sin(2 * Math.PI * carrier * t) * Math.cos(Math.PI * beat * t);
  const envUpper = (t: number) => 2 * Math.cos(Math.PI * beat * t);
  const envLower = (t: number) => -2 * Math.cos(Math.PI * beat * t);

  const s = makeScale(box, 0, 1, -2.2, 2.2);
  const sumPts = sampleCurve(sum, 0, 1, 256);
  const upPts = sampleCurve(envUpper, 0, 1, 96);
  const loPts = sampleCurve(envLower, 0, 1, 96);

  const body =
    axes(box, paint.axis) +
    polyline(sumPts, s, 'stroke: var(--viz-rest); stroke-width: 1.3; fill: none; stroke-linecap: round; stroke-linejoin: round;') +
    polyline(upPts, s, paint.curve) +
    polyline(loPts, s, paint.curve);
  return {
    body,
    desc: `${entry.data.claim} Drawn as two close tones summing into a carrier whose amplitude swells and pinches at the beat rate.`,
  };
};

export default build;
