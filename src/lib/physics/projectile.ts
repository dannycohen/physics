import { STANDARD_GRAVITY } from './constants';

// Projectile motion over level ground, no air resistance, constant gravity.
// Angles are given in degrees; g defaults to Earth's standard gravity.

const toRad = (deg: number) => (deg * Math.PI) / 180;

function assertSpeed(speed: number): void {
  if (!(speed >= 0)) {
    throw new RangeError(`speed must be non-negative, got ${speed}`);
  }
}

/**
 * Horizontal range (m) of a projectile launched at `speed` (m/s) and
 * `angleDeg` (degrees) over level ground: R = v² sin(2θ) / g.
 */
export function range(speed: number, angleDeg: number, g: number = STANDARD_GRAVITY): number {
  assertSpeed(speed);
  return (speed * speed * Math.sin(2 * toRad(angleDeg))) / g;
}

/**
 * Peak height (m) reached: h = (v sinθ)² / (2g).
 */
export function maxHeight(speed: number, angleDeg: number, g: number = STANDARD_GRAVITY): number {
  assertSpeed(speed);
  const vy = speed * Math.sin(toRad(angleDeg));
  return (vy * vy) / (2 * g);
}

/**
 * Time of flight (s) until the projectile returns to launch height:
 * t = 2 v sinθ / g.
 */
export function timeOfFlight(speed: number, angleDeg: number, g: number = STANDARD_GRAVITY): number {
  assertSpeed(speed);
  return (2 * speed * Math.sin(toRad(angleDeg))) / g;
}
