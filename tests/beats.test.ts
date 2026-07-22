import { describe, expect, it } from 'vitest';
import { beatFrequency, carrierFrequency } from '../src/lib/physics/beats';

describe('beatFrequency', () => {
  it('is |f1 - f2|: 4 Hz for 440 and 444', () => {
    expect(beatFrequency(440, 444)).toBe(4);
  });

  it('is symmetric in its arguments', () => {
    expect(beatFrequency(440, 444)).toBe(beatFrequency(444, 440));
  });

  it('is 0 when the two frequencies are equal', () => {
    expect(beatFrequency(440, 440)).toBe(0);
  });

  it('throws RangeError when either frequency is not positive', () => {
    expect(() => beatFrequency(0, 444)).toThrow(RangeError);
    expect(() => beatFrequency(440, 0)).toThrow(RangeError);
    expect(() => beatFrequency(-440, 444)).toThrow(RangeError);
  });
});

describe('carrierFrequency', () => {
  it('is (f1 + f2) / 2: 442 Hz for 440 and 444', () => {
    expect(carrierFrequency(440, 444)).toBe(442);
  });

  it('is symmetric in its arguments', () => {
    expect(carrierFrequency(440, 444)).toBe(carrierFrequency(444, 440));
  });

  it('equals the shared value when the two frequencies are equal', () => {
    expect(carrierFrequency(440, 440)).toBe(440);
  });

  it('throws RangeError when either frequency is not positive', () => {
    expect(() => carrierFrequency(0, 444)).toThrow(RangeError);
    expect(() => carrierFrequency(440, 0)).toThrow(RangeError);
    expect(() => carrierFrequency(440, -444)).toThrow(RangeError);
  });
});
