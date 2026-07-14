import { formatQuantity } from './format';
import type { VizTheme } from './theme';

export interface Series {
  points: Array<[number, number]>;
  color: string;
  label: string;
  dashed?: boolean;
}

const PAD = { top: 14, right: 76, bottom: 44, left: 60 };
const TICKS = 5;
const FONT = '12px system-ui, sans-serif';

export function plotCurve(
  ctx: CanvasRenderingContext2D,
  size: { w: number; h: number },
  theme: VizTheme,
  opts: {
    series: Series[];
    xLabel: string;
    yLabel: string;
    xDomain: [number, number];
    yDomain: [number, number];
    marker?: { x: number; y: number };
  },
): void {
  const { series, xLabel, yLabel, xDomain, yDomain, marker } = opts;
  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;
  const plotW = Math.max(1, size.w - PAD.left - PAD.right);
  const plotH = Math.max(1, size.h - PAD.top - PAD.bottom);
  const sx = (x: number): number => PAD.left + ((x - x0) / (x1 - x0 || 1)) * plotW;
  const sy = (y: number): number => PAD.top + plotH - ((y - y0) / (y1 - y0 || 1)) * plotH;

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, size.w, size.h);
  ctx.font = FONT;

  // Grid + tick labels
  ctx.lineWidth = 1;
  for (let i = 0; i < TICKS; i++) {
    const f = i / (TICKS - 1);
    const xVal = x0 + f * (x1 - x0);
    const yVal = y0 + f * (y1 - y0);
    const gx = sx(xVal);
    const gy = sy(yVal);

    ctx.strokeStyle = theme.grid;
    ctx.beginPath();
    ctx.moveTo(gx, PAD.top);
    ctx.lineTo(gx, PAD.top + plotH);
    ctx.moveTo(PAD.left, gy);
    ctx.lineTo(PAD.left + plotW, gy);
    ctx.stroke();

    ctx.fillStyle = theme.label;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(formatQuantity(xVal, ''), gx, PAD.top + plotH + 6);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatQuantity(yVal, ''), PAD.left - 6, gy);
  }

  // Axes
  ctx.strokeStyle = theme.axis;
  ctx.beginPath();
  ctx.moveTo(PAD.left, PAD.top);
  ctx.lineTo(PAD.left, PAD.top + plotH);
  ctx.lineTo(PAD.left + plotW, PAD.top + plotH);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = theme.label;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(xLabel, PAD.left + plotW / 2, size.h - 4);
  ctx.save();
  ctx.translate(12, PAD.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textBaseline = 'top';
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  // Series lines, clipped to the plot rect
  ctx.save();
  ctx.beginPath();
  ctx.rect(PAD.left, PAD.top, plotW, plotH);
  ctx.clip();
  for (const s of series) {
    if (s.points.length < 2) continue;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    ctx.setLineDash(s.dashed ? [6, 4] : []);
    ctx.beginPath();
    s.points.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(sx(px), sy(py));
      else ctx.lineTo(sx(px), sy(py));
    });
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();

  // Direct labels at the right end of each line (text, so color is never the
  // only channel distinguishing series)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (const s of series) {
    const end = s.points[s.points.length - 1];
    if (!end) continue;
    const ly = Math.min(Math.max(sy(end[1]), PAD.top + 6), PAD.top + plotH - 6);
    // Pull long labels left so they never run off the canvas edge.
    const lx = Math.min(
      Math.min(sx(end[0]), PAD.left + plotW) + 6,
      size.w - 2 - ctx.measureText(s.label).width,
    );
    ctx.fillStyle = s.color;
    ctx.fillText(s.label, lx, ly);
  }

  // Cursor marker
  if (marker) {
    ctx.fillStyle = theme.active;
    ctx.strokeStyle = theme.bg;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx(marker.x), sy(marker.y), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}
