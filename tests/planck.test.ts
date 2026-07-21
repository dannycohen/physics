import { describe, expect, it } from 'vitest';
import { peakWavelength, spectralRadiance } from '../src/lib/physics/planck';

const SUN_K = 5778; // effective photosphere temperature of the Sun

describe('peak wavelength (Wien displacement)', () => {
  it('puts the Sun near 501 nm (green-yellow, middle of the visible band)', () => {
    // ~5.015e-7 m; digits: 8 gives a 5 nm tolerance around 501 nm.
    expect(peakWavelength(SUN_K)).toBeCloseTo(5.01e-7, 8);
  });

  it('halves the peak wavelength when the temperature doubles', () => {
    expect(peakWavelength(2 * SUN_K)).toBeCloseTo(peakWavelength(SUN_K) / 2, 12);
  });

  it('throws on non-positive temperature', () => {
    expect(() => peakWavelength(0)).toThrow(RangeError);
    expect(() => peakWavelength(-300)).toThrow(RangeError);
  });
});

describe('spectral radiance (Planck law)', () => {
  it('is positive for sane inputs', () => {
    expect(spectralRadiance(500e-9, SUN_K)).toBeGreaterThan(0);
  });

  it('is larger at the peak than far into either tail', () => {
    const peak = peakWavelength(SUN_K);
    const atPeak = spectralRadiance(peak, SUN_K);
    expect(atPeak).toBeGreaterThan(spectralRadiance(peak * 0.2, SUN_K)); // ultraviolet
    expect(atPeak).toBeGreaterThan(spectralRadiance(peak * 5, SUN_K)); // infrared
  });

  it('gives a higher peak radiance for a hotter body', () => {
    const cold = spectralRadiance(peakWavelength(3000), 3000);
    const hot = spectralRadiance(peakWavelength(6000), 6000);
    expect(hot).toBeGreaterThan(cold);
  });

  it('throws on non-positive temperature or wavelength', () => {
    expect(() => spectralRadiance(500e-9, 0)).toThrow(RangeError);
    expect(() => spectralRadiance(0, SUN_K)).toThrow(RangeError);
  });
});
