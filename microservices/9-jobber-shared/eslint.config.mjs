import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['build/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // `declare global { namespace Express {...} }` is the standard way to augment
      // Express's Request type — not a stylistic namespace misuse.
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    },
  }
);
