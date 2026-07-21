/** Lorentz factor gamma = 1 / sqrt(1 - beta^2). Throws RangeError unless 0 <= beta < 1. */
export function lorentzFactor(beta: number): number {
  if (!(beta >= 0 && beta < 1)) {
    throw new RangeError(`beta must satisfy 0 <= beta < 1, got ${beta}`);
  }
  return 1 / Math.sqrt(1 - beta * beta);
}

/** Time elapsed in the stationary frame: gamma * properTime. */
export function dilatedTime(properTime: number, beta: number): number {
  return lorentzFactor(beta) * properTime;
}

export const BETA_MAX = 0.999;

// Slider mapping: the linear segment covers [0, 0.9] where gamma changes slowly,
// then a log-spaced tail gives resolution near the light-speed limit.
// pos in [0, 0.7]  -> beta = pos * 9/7                       (linear, 0 -> 0.9)
// pos in (0.7, 1]  -> beta = 1 - 10^(-1 - 2*(pos - 0.7)/0.3) (0.9 -> 0.999)
// Continuous at pos = 0.7 (both branches give 0.9) and strictly monotonic.
export function sliderPosToBeta(pos: number): number {
  if (pos <= 0.7) return pos * (9 / 7);
  return 1 - Math.pow(10, -1 - (2 * (pos - 0.7)) / 0.3);
}

export function betaToSliderPos(beta: number): number {
  if (beta <= 0.9) return beta * (7 / 9);
  return 0.7 + (0.3 * (-1 - Math.log10(1 - beta))) / 2;
}

/** Second-order Taylor expansion of gamma: 1 + beta^2 / 2, the leading relativistic correction to the classical gamma = 1. */
export function taylorGamma2(beta: number): number {
  return 1 + (beta * beta) / 2;
}

/** Contracted length seen for a moving object: L = L0 / gamma = L0 * sqrt(1 - beta^2).
 *  L0 is the proper (rest) length. Contraction is along the direction of motion only. */
export function contractedLength(properLength: number, beta: number): number {
  return properLength / lorentzFactor(beta);
}

// Relativistic energy, all expressed in units of the rest energy E0 = m*c^2, so
// pass E0 and get the pieces of E^2 = (pc)^2 + (mc^2)^2 back in the same unit.

/** Total energy E = gamma * E0. */
export function totalEnergy(restEnergy: number, beta: number): number {
  return lorentzFactor(beta) * restEnergy;
}

/** Momentum term pc = gamma * beta * E0 (the leg of the energy triangle that grows with speed). */
export function momentumEnergy(restEnergy: number, beta: number): number {
  return lorentzFactor(beta) * beta * restEnergy;
}

/** Kinetic energy KE = (gamma - 1) * E0. */
export function kineticEnergy(restEnergy: number, beta: number): number {
  return (lorentzFactor(beta) - 1) * restEnergy;
}
