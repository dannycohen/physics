import { describe, expect, it } from 'vitest';
import { observedFrequency } from '../src/lib/physics/acoustic-doppler';

describe('observedFrequency (acoustic Doppler)', () => {
  it('leaves the source frequency unchanged when the source is at rest', () => {
    expect(observedFrequency(440, 0)).toBe(440);
  });

  it('raises the pitch when the source approaches (positive speed)', () => {
    expect(observedFrequency(440, 34.3)).toBeGreaterThan(440);
  });

  it('lowers the pitch when the source recedes (negative speed)', () => {
    expect(observedFrequency(440, -34.3)).toBeLessThan(440);
  });

  it('matches the known value for 440 Hz at 34.3 m/s toward the observer (v = 343)', () => {
    // f' = 440 · 343 / (343 − 34.3) = 440 · 1.111… ≈ 489 Hz
    expect(observedFrequency(440, 34.3, 343)).toBeCloseTo(489, 0);
  });

  it('throws RangeError when the source reaches the speed of sound', () => {
    expect(() => observedFrequency(440, 343, 343)).toThrow(RangeError);
  });

  it('throws RangeError for supersonic source speeds', () => {
    expect(() => observedFrequency(440, 400, 343)).toThrow(RangeError);
    expect(() => observedFrequency(440, -343, 343)).toThrow(RangeError);
  });
});
