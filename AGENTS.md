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
- **Kelvin always shows Celsius and Fahrenheit.** Any page with a temperature in
  kelvin must display a live Celsius/Fahrenheit translation beside the reading.
  Drop `<TempConversions slug={...} value={defaultTempK} />`
  (`src/components/viz/TempConversions.astro`) right after the temperature
  `SliderField`; it binds to the same `tempK` store key and updates as the slider
  moves. Both the Maxwell–Boltzmann and Planck pages follow this.
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

## Don't duplicate

The shared layer above exists so pages and islands stay thin. Before adding markup, CSS,
or logic, check whether it already exists and reuse it.

- **Reuse before adding.** A new page, island, or builder should lean on the existing
  components (`SliderField`, `PresetButtons`/`LimitSnaps`, `TempConversions`), helpers
  (`createVizCanvas`, `plotCurve`, `getVizStore`, `formatQuantity`), and shared classes in
  `src/styles/{tokens,viz}.css`. Extend the shared thing; don't copy it into a new file.
- **CSS shared by two or more files lives in the shared layer.** Put common visual patterns
  in `src/styles/viz.css` (viz) or `tokens.css` (chrome) as a class; a per-file `<style>`
  block is only for genuinely one-off rules. Never write a colour literal outside
  `tokens.css` — reference `var(--…)`.
- **Constants live once.** Physical constants and per-viz defaults belong in
  `src/lib/physics/` and are imported where needed — never retyped across an island's
  frontmatter and its client `<script>`, and never as a literal in MDX frontmatter (this
  extends "no physical-constant literals" above to content).
- **MDX pages carry only their unique content.** Control scaffolding, `slug` wiring, and the
  presets/limits/reset row come from the shared components, not copy-paste across pages.
- **Rule of three.** The third copy of a pattern is the signal to extract it into the shared
  layer. If you deliberately leave duplication, say why in the PR.

## Before committing

`npm run test` (physics anchors), `npx astro check` (0 errors), and `npm run build` must all
pass. CI also runs a client-JS bundle-size gate.

A CI **duplication** job mechanically enforces the "Don't duplicate" rules above:

- `npm run check:dup` — jscpd copy-paste detector (fails over 3% duplicated tokens). **Blocking.**
- The constant-literal grep gate — fails if a physical-constant value (scientific notation,
  or the bare speed of light) appears in `src/content/**` or an island; put it in
  `src/lib/physics/constants.ts`. **Blocking.**
- `npm run check:styles` (stylelint: duplicate properties/selectors + colour-literal discipline)
  and `npm run check:knip` (dead exports) run **warn-only** for now, to be promoted to blocking
  once the current tree is clean.
