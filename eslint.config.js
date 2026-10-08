import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', '*.config.*', 'coverage/', '.vite/', 'specs/', 'public/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        es2022: true,
        React: 'writable',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: '18.3',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'testing-library': testingLibraryPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'testing-library/no-unnecessary-act': 'warn',
    },
  },
  {
    /* Node scripts under scripts/ run in Node, not in a browser. They are .mjs so they stay outside the
       TypeScript program and outside Vite's module graph, which is what keeps the audit script out of
       the bundle. Without this they are linted with browser globals and every `process` and `console`
       reads as undefined. */
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        es2022: true,
      },
    },
  },
  {
    /* The testing-library rules are written for React Testing Library and are applied to every .ts file
       above. Playwright exposes its own `page.getByRole`, which is not an RTL render result and has no
       `screen` to be read from, so `prefer-screen-queries` fires on a correct Playwright assertion.

       Scoped to the browser tests. The rules about DOM traversal rather than about which query API is
       called stay on: those files measure through page.evaluate and locator assertions rather than
       reaching into the DOM, and that is enforced rather than assumed. */
    files: ['tests/e2e/**/*.spec.ts'],
    rules: {
      'testing-library/prefer-screen-queries': 'off',
    },
  }
);