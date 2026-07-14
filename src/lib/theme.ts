export interface VizTheme {
  rest: string;
  active: string;
  limit: string;
  grid: string;
  axis: string;
  curve: string;
  curveSecondary: string;
  label: string;
  bg: string;
}

const PROPS = {
  rest: '--viz-rest',
  active: '--viz-active',
  limit: '--viz-limit',
  grid: '--viz-grid',
  axis: '--viz-axis',
  curve: '--viz-curve',
  curveSecondary: '--viz-curve-secondary',
  label: '--viz-label',
  bg: '--viz-bg',
} as const satisfies Record<keyof VizTheme, string>;

export function readVizTheme(el: Element): VizTheme {
  const style = getComputedStyle(el);
  const theme = {} as VizTheme;
  for (const key of Object.keys(PROPS) as Array<keyof VizTheme>) {
    theme[key] = style.getPropertyValue(PROPS[key]).trim();
  }
  return theme;
}

export function onThemeChange(cb: () => void): () => void {
  if (typeof matchMedia !== 'function') return () => {};
  const mq = matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
