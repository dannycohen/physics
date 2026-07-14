import { describe, expect, it } from 'vitest';
import { formatQuantity } from '../src/lib/format';

const NNBSP = ' ';

describe('formatQuantity', () => {
  it('joins value and unit with a narrow no-break space', () => {
    expect(formatQuantity(1.25, 's')).toBe(`1.25${NNBSP}s`);
  });

  it('defaults to 3 significant figures', () => {
    expect(formatQuantity(1.23456, 's')).toBe(`1.23${NNBSP}s`);
    expect(formatQuantity(299_792_458, 'm/s')).toBe(`300,000,000${NNBSP}m/s`);
  });

  it('honors an explicit sigFigs option', () => {
    expect(formatQuantity(1.23456, 's', { sigFigs: 5 })).toBe(`1.2346${NNBSP}s`);
    expect(formatQuantity(0.999, '', { sigFigs: 3 })).toBe('0.999');
  });

  it('returns a bare number string when unit is empty', () => {
    expect(formatQuantity(0.6, '')).toBe('0.6');
    expect(formatQuantity(0.6, '')).not.toContain(NNBSP);
  });

  it('does not pad integers with trailing zeros', () => {
    expect(formatQuantity(2, 's')).toBe(`2${NNBSP}s`);
  });
});
