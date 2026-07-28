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
      // Tuned to pass the current tree (stmts 99%, branches 98%, funcs 100%,
      // lines 99%) with a little headroom, then ratcheted up. See AGENTS.md.
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 95,
        lines: 95,
      },
    },
  },
});
