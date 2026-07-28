// Static-analysis config for the CI "analysis" phase (see .github/workflows/ci.yml).
// Deliberately lightweight: we lint the TypeScript logic under src/ and the build
// scripts, and enforce complexity budgets rather than a full style ruleset. The
// .astro components are thin view glue and are covered by `astro check`, so they
// stay out of scope here to keep the phase fast and focused on logic complexity.
import tseslint from 'typescript-eslint';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  { ignores: ['dist/**', 'node_modules/**', '.astro/**', 'coverage/**'] },
  {
    files: ['src/**/*.ts', 'scripts/**/*.mjs'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { sonarjs },
    rules: {
      // Cyclomatic complexity per function. Set at the current tree's maximum
      // (createVizCanvas = 17) as a non-regression ceiling: nothing may get worse,
      // and the target is to ratchet down toward 12 (see AGENTS.md "Before committing").
      complexity: ['error', { max: 17 }],
      'max-depth': ['error', 4],
      // Cognitive complexity: how hard a function is to *read*, not just its branch count.
      'sonarjs/cognitive-complexity': ['error', 15],
      // Duplication smells that pair with the complexity budget.
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-duplicated-branches': 'error',
    },
  },
];
