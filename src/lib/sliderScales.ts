import { betaToSliderPos, sliderPosToBeta } from './physics/relativity';

export type ScaleName = 'linear' | 'log' | 'beta';

export interface SliderScale {
  toValue(pos: number, min: number, max: number): number;
  toPos(value: number, min: number, max: number): number;
}

export const sliderScales: Record<ScaleName, SliderScale> = {
  linear: {
    toValue: (pos, min, max) => min + pos * (max - min),
    toPos: (value, min, max) => (value - min) / (max - min),
  },
  // Requires min > 0.
  log: {
    toValue: (pos, min, max) => min * Math.pow(max / min, pos),
    toPos: (value, min, max) => Math.log(value / min) / Math.log(max / min),
  },
  // The physics mapping fixes its own domain [0, BETA_MAX]; min/max are ignored.
  beta: {
    toValue: (pos) => sliderPosToBeta(pos),
    toPos: (value) => betaToSliderPos(value),
  },
};
