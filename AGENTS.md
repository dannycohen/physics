# Contributing a visualization

Conventions for adding or editing a physics visualization. Machine- and human-readable;
the build enforces the required parts.

## Anatomy of a page

Each visualization is one MDX file under `src/content/viz/<category>/<slug>.mdx`, validated
against the Zod schema in `src/content.config.ts`. The frontmatter carries the metadata,
equation, and terms; the body writes the interactive content.

The page layout is **frozen** (validated across the comparison, distribution, and
field-space archetypes — time dilation, Maxwell–Boltzmann, Coulomb). `VizLayout` renders,
in order: the title, the `claim`, the MDX body, and an auto-generated "Show the math" panel
built from `equationLatex` and `terms`. The MDX body is always structured the same way:

1. the interactive island(s) — the hero canvas first (it seeds the shared store);
2. a `<div class="viz-controls">` holding `SliderField`/`PresetButtons`/`LimitSnaps`/`ResetButton`;
3. prose sections and a `<details class="misconception">`.

An island that has a canvas emits its own `<details class="view-table">` fallback; the
shared styles for `.canvas-box` and `.view-table` live in `src/styles/viz.css` (do not
re-declare them per component — only set the canvas `aspect-ratio`). Adding a page is pure
content plus its island(s); `VizLayout` is not edited per page.

## Required features (enforced or checked)

- **Every equation symbol has a tooltip.** Each entry in the frontmatter `terms[]` array
  **must** include a `name` — the spoken name of the symbol, e.g.
  `'Gamma: Greek lowercase gamma'` or `'k-B: the Boltzmann constant'`. It renders in the
  "Show the math" table as the native hover tooltip (`title`) and as visually-hidden text
  for screen readers, on the symbol itself. `name` is a **required** field in the Zod term
  schema, so the build fails if any symbol is missing its tooltip. This is a hard rule: no
  equation ships with an unexplained symbol.
- **No physical-constant literals in pages or components.** Constants live only in
  `src/lib/physics/constants.ts` (CODATA/SI values, each commented with source and units).
  Pure physics functions live in `src/lib/physics/` and are covered by Vitest anchors in
  `tests/`.
- **Accessibility (WCAG 2.2 AA).** Every canvas has a descriptive `aria-label` and a
  "View as table" text/data equivalent; derived readouts have a screen-reader channel;
  colour is never the only way to tell series apart; animations honour
  `prefers-reduced-motion`. `.visually-hidden` (in `src/styles/tokens.css`) is the utility
  for screen-reader-only text.
- **Base path.** Build every internal URL with `import.meta.env.BASE_URL`; never hardcode a
  leading `/`. Verify with `astro preview` (honours the `/physics` base), not `astro dev`.

## Shared building blocks

- State: `getVizStore(slug, defaults)` (`src/lib/vizStore.ts`). The island that owns the
  page's defaults must create the store; place it first in the MDX body so it seeds before
  the controls connect.
- Controls: `SliderField`, `PresetButtons`, `LimitSnaps`, `ResetButton`.
- Charts: `plotCurve` (`src/lib/plotCurve.ts`) on the DPR-aware `createVizCanvas`
  (`src/lib/canvas.ts`); read colours from the cached theme, never hardcode them.
- Formatting: route every number through `formatQuantity` so the visible readout and the
  `aria-valuetext` are identical strings.

## Before committing

`npm run test` (physics anchors), `npx astro check` (0 errors), and `npm run build` must all
pass. CI also runs a client-JS bundle-size gate.
