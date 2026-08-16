import { expect, test, type Page } from '@playwright/test';

interface ProjectileMarker {
  x: number;
  y: number;
}

declare global {
  interface Window {
    projectileMarkers: ProjectileMarker[];
  }
}

async function setSlider(page: Page, label: string, value: number): Promise<ProjectileMarker[]> {
  const markerCount = await page.evaluate(() => window.projectileMarkers.length);
  await page.getByRole('slider', { name: label }).evaluate((element, nextValue) => {
    const slider = element as HTMLInputElement;
    slider.valueAsNumber = nextValue;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);

  await expect
    .poll(() => page.evaluate(() => window.projectileMarkers.length))
    .toBeGreaterThan(markerCount);
  return page.evaluate(() => window.projectileMarkers.slice(-2));
}

test('projectile landing geometry uses a stable scale', async ({ page }) => {
  await page.addInitScript(() => {
    window.projectileMarkers = [];
    const originalArc = CanvasRenderingContext2D.prototype.arc;
    CanvasRenderingContext2D.prototype.arc = function (...args) {
      const [x, y, radius] = args;
      if (radius === 6) window.projectileMarkers.push({ x, y });
      return originalArc.apply(this, args);
    };
  });

  await page.goto('viz/classical-mechanics/projectile-range/');
  await expect
    .poll(() => page.evaluate(() => window.projectileMarkers.length))
    .toBeGreaterThanOrEqual(2);

  const angle20 = await setSlider(page, 'Launch angle', 20);
  const angle70 = await setSlider(page, 'Launch angle', 70);
  const angle45 = await setSlider(page, 'Launch angle', 45);
  const landing20 = angle20[1]!.x;
  const landing70 = angle70[1]!.x;
  const landing45 = angle45[1]!.x;

  expect(landing20).toBeCloseTo(landing70, 5);
  expect(landing45).toBeGreaterThan(landing20);

  const speed10 = await setSlider(page, 'Launch speed', 10);
  const speed30 = await setSlider(page, 'Launch speed', 30);
  const distance10 = speed10[1]!.x - speed10[0]!.x;
  const distance30 = speed30[1]!.x - speed30[0]!.x;

  expect(distance30).toBeGreaterThan(distance10);
  expect(distance30 / distance10).toBeCloseTo(9, 5);
  await expect(
    page.getByText('Fixed canvas scale: 0 to 165 m horizontally and 0 to 85 m vertically.'),
  ).toBeVisible();
});
