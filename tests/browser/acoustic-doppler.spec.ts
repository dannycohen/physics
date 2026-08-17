import { expect, test, type Page } from '@playwright/test';
import { formatQuantity } from '../../src/lib/format';
import { observedFrequency } from '../../src/lib/physics/acoustic-doppler';

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

const frequencyText = (frequency: number) =>
  formatQuantity(frequency, 'Hz', { sigFigs: 3 });
const pitchWord = (speed: number) => (speed > 0 ? 'higher' : speed < 0 ? 'lower' : 'the same');

async function setSourceFrequency(page: Page, frequency: number): Promise<void> {
  await page.getByRole('slider', { name: 'Source pitch' }).evaluate((element, value) => {
    const slider = element as HTMLInputElement;
    slider.valueAsNumber = value;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }, frequency);
}

async function expectFrequencyAgreement(
  page: Page,
  sourceFrequency: number,
  sourceSpeed: number,
): Promise<void> {
  const source = frequencyText(sourceFrequency);
  const observed = frequencyText(observedFrequency(sourceFrequency, sourceSpeed));
  await expect(page.locator('slider-field[data-store-key="sourceFreq"] output')).toHaveText(source);
  await expect(page.locator('acoustic-doppler .pitch-stat')).toContainText(`Source ${source}`);
  await expect(page.locator('acoustic-doppler .observed-val')).toHaveText(observed);
  await expect(page.locator('acoustic-doppler .visually-hidden')).toHaveText(
    `A ${source} source is heard as ${observed}: ${pitchWord(sourceSpeed)} pitch.`,
  );
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

test('source frequency stays current through controls, presets, and reset', async ({ page }) => {
  await page.goto('viz/waves-optics/acoustic-doppler/');
  await expectFrequencyAgreement(page, 440, 30);

  await setSourceFrequency(page, 200);
  await expectFrequencyAgreement(page, 200, 30);
  await setSourceFrequency(page, 800);
  await expectFrequencyAgreement(page, 800, 30);

  await page.getByRole('button', { name: /Receding/ }).click();
  await expectFrequencyAgreement(page, 800, -30);
  await page.getByRole('button', { name: 'Reset to 30 m/s' }).click();
  await expectFrequencyAgreement(page, 440, 30);
});
