# Physics, one equation at a time

Interactive visualizations that explain the meaning and structure of the equations of
physics. Each page takes one governing equation, puts it under a slider, and explains
why it has the shape it does.

Live site: https://dannycohen.github.io/physics/

## Commands

| Command             | Action                                          |
| ------------------- | ----------------------------------------------- |
| `npm install`       | Install dependencies                            |
| `npm run dev`       | Dev server at `localhost:4321`                  |
| `npm run build`     | Production build to `./dist/`                   |
| `npm run preview`   | Serve the build locally (honors the `/physics` base path — use this, not `dev`, to check links) |
| `npm run test`      | Vitest suite for the physics functions          |
| `npm run typecheck` | `astro check`                                   |

## Architecture

- [Astro](https://astro.build) static site; only interactive widgets hydrate as islands.
- Equations render at build time with KaTeX (`remark-math` + `rehype-katex`,
  `htmlAndMathml` output for screen readers). No KaTeX JS ships to the client.
- One MDX entry per visualization in `src/content/viz/`, validated by the Zod schema in
  `src/content.config.ts`.
- Pure physics functions and constants live in `src/lib/physics/` — no physical-constant
  literal appears anywhere else. Vitest anchors them to known analytic values.
- Interactive state is [nanostores](https://github.com/nanostores/nanostores) via
  `getVizStore()`; canvas widgets draw through the DPR-aware helper in `src/lib/canvas.ts`
  and read colors from CSS custom properties (see `src/styles/tokens.css`).

Deployment is GitHub Actions → GitHub Pages on push to `main` (`.github/workflows/`).
CI gates PRs with typecheck, tests, build, and a client-JS bundle budget.

## Adding a visualization

See [`AGENTS.md`](./AGENTS.md) for the full conventions. One rule the build enforces:
every equation symbol listed in a page's `terms[]` **must** have a `name`, which becomes a
hover tooltip and screen-reader label on that symbol in "Show the math". The `name` field
is required in the content schema, so an equation with an unexplained symbol fails the build.

## License

Code is MIT (see `LICENSE`). Prose and figures are
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Third-party assets are listed
in `ATTRIBUTIONS.md`.

## Notes

The alternative landing pages were built through a self-repeating agent loop; the
[Ralph-loop retrospective](./docs/ralph-wiggum-retrospective-analysis.md) records how that
run went, what to change, and a rephrased prompt that folds the lessons back in.
