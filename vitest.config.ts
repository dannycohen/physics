import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      // Scope coverage thresholds to the pure physics anchors. AGENTS.md defines
      // these as the functions tests/ locks down; the view glue and SVG poster
      // builders are validated by `astro check` and the build, not unit-covered,
      // so including them here would make the threshold meaningless.
      include: ['src/lib/physics/**'],
      reporter: ['text-summary', 'text'],
      // The physics anchors are fully covered, so every metric is held at 100%:
      // any uncovered line, branch, or function in src/lib/physics fails CI. See AGENTS.md.
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
