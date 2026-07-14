import { onThemeChange, readVizTheme, type VizTheme } from './theme';

export interface VizCanvasHandle {
  redraw(): void;
  setPlaying(p: boolean): void;
  isPlaying(): boolean;
  destroy(): void;
}

const DPR_CAP = 2.5;

export function createVizCanvas(
  canvas: HTMLCanvasElement,
  draw: (
    ctx: CanvasRenderingContext2D,
    size: { w: number; h: number },
    theme: VizTheme,
    tMs: number,
  ) => void,
  opts?: { animate?: boolean },
): VizCanvasHandle {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('createVizCanvas: 2d context unavailable');

  let theme = readVizTheme(canvas);
  let size = { w: 0, h: 0 };
  let destroyed = false;

  const reducedMotion =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playing = Boolean(opts?.animate) && !reducedMotion;
  let inView = true;
  let pageVisible = typeof document === 'undefined' || document.visibilityState !== 'hidden';

  let tMs = 0;
  let lastTs: number | null = null;
  let rafId = 0;
  let resizeRaf = 0;
  let lastDpr = 0;

  function render(): void {
    if (destroyed || size.w <= 0 || size.h <= 0) return;
    draw(ctx!, size, theme, tMs);
  }

  function frame(ts: number): void {
    rafId = 0;
    if (destroyed) return;
    if (lastTs !== null) tMs += ts - lastTs;
    lastTs = ts;
    render();
    schedule();
  }

  function schedule(): void {
    if (playing && inView && pageVisible && rafId === 0 && !destroyed) {
      rafId = requestAnimationFrame(frame);
    }
  }

  function halt(): void {
    if (rafId !== 0) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    // Drop the timestamp so paused wall-clock time never enters tMs.
    lastTs = null;
  }

  function resize(): void {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    if (rect.width === size.w && rect.height === size.h && dpr === lastDpr && canvas.width > 0)
      return;
    size = { w: rect.width, h: rect.height };
    lastDpr = dpr;
    canvas.width = Math.max(1, Math.round(size.w * dpr));
    canvas.height = Math.max(1, Math.round(size.h * dpr));
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  const unsubTheme = onThemeChange(() => {
    theme = readVizTheme(canvas);
    render();
  });

  function scheduleResize(): void {
    if (resizeRaf !== 0) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0;
      resize();
    });
  }

  const resizeObserver =
    typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleResize) : null;
  if (resizeObserver && canvas.parentElement) resizeObserver.observe(canvas.parentElement);

  // Rebuild the backing store when devicePixelRatio changes (browser zoom, or
  // the window moving to a display with a different density). The media query
  // matches only the DPR it was created at, so re-arm it inside the handler.
  let dprMql: MediaQueryList | null = null;
  const onDprChange = (): void => {
    armDpr();
    scheduleResize();
  };
  function armDpr(): void {
    dprMql?.removeEventListener('change', onDprChange);
    dprMql = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    dprMql.addEventListener('change', onDprChange);
  }
  if (typeof matchMedia === 'function') armDpr();

  const intersectionObserver =
    opts?.animate && typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(
          (entries) => {
            const entry = entries[entries.length - 1];
            if (!entry) return;
            inView = entry.isIntersecting;
            if (inView) schedule();
            else halt();
          },
          { threshold: 0.1 },
        )
      : null;
  intersectionObserver?.observe(canvas);

  const onVisibility = (): void => {
    pageVisible = document.visibilityState !== 'hidden';
    if (pageVisible) schedule();
    else halt();
  };
  if (opts?.animate && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibility);
  }

  resize(); // static first frame at tMs = 0 (all reduced-motion users ever see)
  schedule();

  return {
    redraw() {
      render();
    },
    setPlaying(p: boolean) {
      if (p === playing) return;
      playing = p;
      if (p) schedule();
      else halt();
    },
    isPlaying() {
      return playing;
    },
    destroy() {
      destroyed = true;
      halt();
      if (resizeRaf !== 0) cancelAnimationFrame(resizeRaf);
      dprMql?.removeEventListener('change', onDprChange);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (opts?.animate && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibility);
      }
      unsubTheme();
    },
  };
}
