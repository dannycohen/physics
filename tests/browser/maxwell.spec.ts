import { expect, test, type Page } from '@playwright/test';

declare global {
  interface Window {
    maxwellMostProbableXs: number[];
  }
}

async function selectGas(page: Page, name: string): Promise<number> {
  const markerCount = await page.evaluate(() => window.maxwellMostProbableXs.length);
  await page.getByRole('button', { name, exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.maxwellMostProbableXs.length))
    .toBeGreaterThan(markerCount);
  return page.evaluate(() => window.maxwellMostProbableXs.at(-1)!);
}

test('gas mass moves speed markers on a stable Maxwell scale', async ({ page }) => {
  await page.addInitScript(() => {
    window.maxwellMostProbableXs = [];
    const dashPatterns = new WeakMap<CanvasRenderingContext2D, string>();
    const originalSetLineDash = CanvasRenderingContext2D.prototype.setLineDash;
    CanvasRenderingContext2D.prototype.setLineDash = function (segments) {
      dashPatterns.set(this, segments.join(','));
      return originalSetLineDash.call(this, segments);
    };
    const originalMoveTo = CanvasRenderingContext2D.prototype.moveTo;
    CanvasRenderingContext2D.prototype.moveTo = function (x, y) {
      if (dashPatterns.get(this) === '2,3') window.maxwellMostProbableXs.push(x);
      return originalMoveTo.call(this, x, y);
    };
  });

  await page.goto('viz/thermodynamics/maxwell-boltzmann/');
  await expect
    .poll(() => page.evaluate(() => window.maxwellMostProbableXs.length))
    .toBeGreaterThanOrEqual(1);

  const hydrogenX = await selectGas(page, 'Hydrogen (H₂)');
  const xenonX = await selectGas(page, 'Xenon');

  expect(hydrogenX).toBeGreaterThan(xenonX + 100);
  await expect(page.getByText('Fixed speed scale: 0 to 5,000 m/s.')).toBeVisible();
  await page.locator('maxwell-distribution details.view-table summary').click();
  await expect(
    page.getByRole('columnheader', { name: 'Relative number of molecules (nitrogen at 100 K peak = 1)' }),
  ).toBeVisible();
});
