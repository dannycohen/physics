import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

// Flat config. Type-aware linting is intentionally left off: `astro check`
// already type-checks the project, so ESLint here covers only what a type
// checker does not (unused vars, unsafe patterns, Astro-specific rules).
export default tseslint.config(
  { ignores: ['dist/', '**/.astro/', '**/node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Physical constants in src/lib/physics/constants.ts carry full CODATA
      // precision on purpose, beyond what a double can represent exactly.
      'no-loss-of-precision': 'off',
      // formatQuantity joins a number and its unit with U+202F (narrow
      // no-break space) — intentional typography, not a stray character.
      'no-irregular-whitespace': ['error', { skipTemplates: true }],
    },
  },
);
