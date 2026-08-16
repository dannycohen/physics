import { expect, test, type Page } from '@playwright/test';

interface DopplerFrame {
  sourceX: number;
  observerX: number;
  waveRightEdges: number[];
}

declare global {
  interface Window {
    acousticDopplerFrames: DopplerFrame[];
  }
}

async function setSourceSpeed(page: Page, speed: number): Promise<DopplerFrame> {
  const frameCount = await page.evaluate(() => window.acousticDopplerFrames.length);
  await page.getByRole('slider', { name: 'Source speed toward you' }).evaluate((element, value) => {
    const slider = element as HTMLInputElement;
    slider.valueAsNumber = value;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }, speed);
  await expect
    .poll(() => page.evaluate(() => window.acousticDopplerFrames.length))
    .toBeGreaterThan(frameCount);
  return page.evaluate(() => window.acousticDopplerFrames.at(-1)!);
}

function meanWavefrontGap(frame: DopplerFrame): number {
  const edges = frame.waveRightEdges.toSorted((a, b) => a - b);
  const gaps = edges.slice(1).map((edge, index) => edge - edges[index]!);
  return gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
}

test('source direction matches observer-side wavefront spacing', async ({ page }) => {
  await page.addInitScript(() => {
    window.acousticDopplerFrames = [];
    let observerX = 0;
    let waveRightEdges: number[] = [];

    const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      observerX = 0;
      waveRightEdges = [];
      return originalFillRect.apply(this, args);
    };

    const originalArc = CanvasRenderingContext2D.prototype.arc;
    CanvasRenderingContext2D.prototype.arc = function (...args) {
      const [x, , radius] = args;
      if (radius > 20) waveRightEdges.push(x + radius);
      if (radius === 8) observerX = x;
      if (radius === 9) {
        window.acousticDopplerFrames.push({
          sourceX: x,
          observerX,
          waveRightEdges: [...waveRightEdges],
        });
      }
      return originalArc.apply(this, args);
    };
  });

  await page.goto('viz/waves-optics/acoustic-doppler/');
  await expect
    .poll(() => page.evaluate(() => window.acousticDopplerFrames.length))
    .toBeGreaterThanOrEqual(1);

  const canvas = page.locator('acoustic-doppler canvas');
  const approaching = await page.evaluate(() => window.acousticDopplerFrames.at(-1)!);
  await expect(canvas).toHaveAttribute('aria-label', /moving right toward.*compressed.*higher pitch/i);
  const stationary = await setSourceSpeed(page, 0);
  await expect(canvas).toHaveAttribute('aria-label', /stationary.*evenly spaced.*unchanged/i);
  const receding = await setSourceSpeed(page, -30);
  await expect(canvas).toHaveAttribute('aria-label', /moving left away.*expanded.*lower pitch/i);

  for (const frame of [approaching, stationary, receding]) {
    expect(frame.sourceX).toBeLessThan(frame.observerX);
    expect(frame.waveRightEdges).toHaveLength(4);
  }
  expect(meanWavefrontGap(approaching)).toBeLessThan(meanWavefrontGap(stationary));
  expect(meanWavefrontGap(stationary)).toBeLessThan(meanWavefrontGap(receding));
});
