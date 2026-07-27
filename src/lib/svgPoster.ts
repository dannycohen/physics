// DOM-free SVG-string builders for the per-equation "posters" on the landing
// gallery. These run in Astro frontmatter at build time: no browser, no canvas,
// no measureText. Geometry (path `d`, coordinates) is intrinsic and fixed across
// themes; all paint is applied through inline `style` using CSS custom properties.
// A `style` attribute is a CSS context, so `var(--token)` substitutes there -
// unlike an SVG presentation attribute (`stroke="var(...)"`), which does not and
// would render as invisible black. Posters therefore re-theme straight from
// tokens.css with no rebuild and no JS.

export interface Box {
  w: number;
  h: number;
  pad: number;
}

export const DEFAULT_BOX: Box = { w: 160, h: 100, pad: 12 };

export interface Scale {
  x: (v: number) => number;
  y: (v: number) => number;
}

// Round to 2dp so generated markup stays compact and byte-deterministic.
const n = (v: number): number => Math.round(v * 100) / 100;

/** Map data domain [x0,x1] x [y0,y1] onto the padded box, y flipped for screen coords. */
export function makeScale(box: Box, x0: number, x1: number, y0: number, y1: number): Scale {
  const { w, h, pad } = box;
  const sx = (w - 2 * pad) / (x1 - x0 || 1);
  const sy = (h - 2 * pad) / (y1 - y0 || 1);
  return {
    x: (v) => pad + (v - x0) * sx,
    y: (v) => h - pad - (v - y0) * sy,
  };
}

export type Pt = [number, number];

/** Sample fn across [x0,x1] into count+1 evenly spaced [x, fn(x)] points. */
export function sampleCurve(
  fn: (x: number) => number,
  x0: number,
  x1: number,
  count = 48,
): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= count; i++) {
    const x = x0 + ((x1 - x0) * i) / count;
    pts.push([x, fn(x)]);
  }
  return pts;
}

function pathData(pts: Pt[], s: Scale): string {
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${n(s.x(x))} ${n(s.y(y))}`).join(' ');
}

/** Open stroked curve through the points. */
export function polyline(pts: Pt[], s: Scale, style: string): string {
  return `<path d="${pathData(pts, s)}" fill="none" style="${style}"/>`;
}

/** Filled area between the curve and a horizontal baseline (in data-space y). */
export function areaUnderCurve(pts: Pt[], s: Scale, baselineY: number, style: string): string {
  if (pts.length === 0) return '';
  const first = pts[0] as Pt;
  const last = pts[pts.length - 1] as Pt;
  const d =
    `${pathData(pts, s)}` +
    ` L${n(s.x(last[0]))} ${n(s.y(baselineY))}` +
    ` L${n(s.x(first[0]))} ${n(s.y(baselineY))} Z`;
  return `<path d="${d}" stroke="none" style="${style}"/>`;
}

/** Straight line between two data-space points. */
export function line(a: Pt, b: Pt, s: Scale, style: string): string {
  return `<line x1="${n(s.x(a[0]))}" y1="${n(s.y(a[1]))}" x2="${n(s.x(b[0]))}" y2="${n(s.y(b[1]))}" style="${style}"/>`;
}

/** Filled dot at a data-space point. r is in box units. */
export function dot(p: Pt, s: Scale, r: number, style: string): string {
  return `<circle cx="${n(s.x(p[0]))}" cy="${n(s.y(p[1]))}" r="${n(r)}" style="${style}"/>`;
}

/** Circle at a data-space centre; radius r is in box units. Paint via style. */
export function circle(p: Pt, r: number, s: Scale, style: string): string {
  return `<circle cx="${n(s.x(p[0]))}" cy="${n(s.y(p[1]))}" r="${n(r)}" style="${style}"/>`;
}

/** Ellipse at a data-space centre; radii rx, ry are in box units. */
export function ellipse(center: Pt, rx: number, ry: number, s: Scale, style: string): string {
  return `<ellipse cx="${n(s.x(center[0]))}" cy="${n(s.y(center[1]))}" rx="${n(rx)}" ry="${n(ry)}" style="${style}"/>`;
}

/** Rectangle spanning two data-space corners. */
export function rect(a: Pt, b: Pt, s: Scale, style: string): string {
  const x0 = Math.min(s.x(a[0]), s.x(b[0]));
  const x1 = Math.max(s.x(a[0]), s.x(b[0]));
  const y0 = Math.min(s.y(a[1]), s.y(b[1]));
  const y1 = Math.max(s.y(a[1]), s.y(b[1]));
  return `<rect x="${n(x0)}" y="${n(y0)}" width="${n(x1 - x0)}" height="${n(y1 - y0)}" style="${style}"/>`;
}

/** Identity scale: data coordinates ARE box coordinates (0..w, 0..h, y down).
 *  Use for scene builders that place marks directly in the 160x100 viewBox. */
export const identityScale: Scale = { x: (v) => v, y: (v) => v };

/** L-shaped axis (left + bottom) drawn in box coordinates via an identity scale. */
export function axes(box: Box, style: string): string {
  const { w, h, pad } = box;
  return (
    `<path d="M${pad} ${pad} L${pad} ${h - pad} L${w - pad} ${h - pad}" fill="none" style="${style}"/>`
  );
}

// Common paint recipes. --glyph-accent is the archetype accent, set on the <svg>
// wrapper and inherited here; the --viz-* structural tokens come from tokens.css.
export const paint = {
  curve: 'stroke: var(--glyph-accent); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round;',
  fill: 'fill: var(--glyph-accent); opacity: 0.16;',
  axis: 'stroke: var(--viz-axis); stroke-width: 1;',
  grid: 'stroke: var(--viz-grid); stroke-width: 1; stroke-dasharray: 2 3;',
  reference: 'stroke: var(--viz-axis); stroke-width: 1.2; stroke-dasharray: 3 3;',
  accentDot: 'fill: var(--glyph-accent);',
  restDot: 'fill: var(--viz-rest);',
  activeDot: 'fill: var(--viz-active);',
  mark: 'stroke: var(--viz-bg); stroke-width: 1.4; stroke-linecap: round;',
};
