const formatters = new Map<number, Intl.NumberFormat>();

function getFormatter(sigFigs: number): Intl.NumberFormat {
  let fmt = formatters.get(sigFigs);
  if (!fmt) {
    fmt = new Intl.NumberFormat('en-US', { maximumSignificantDigits: sigFigs });
    formatters.set(sigFigs, fmt);
  }
  return fmt;
}

/**
 * Formats a numeric readout. The narrow no-break space (U+202F) before the
 * unit keeps value and unit on one line. Every visible readout and its
 * aria-valuetext must both come from this function so they are identical.
 */
export function formatQuantity(value: number, unit: string, opts?: { sigFigs?: number }): string {
  const num = getFormatter(opts?.sigFigs ?? 3).format(value);
  return unit === '' ? num : `${num} ${unit}`;
}
