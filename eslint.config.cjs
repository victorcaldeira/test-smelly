// eslint.config.cjs
const js = require('@eslint/js');
const globals = require('globals');
const jest = require('eslint-plugin-jest');

module.exports = [
  // Regras recomendadas de JS
  js.configs.recommended,

  // Config geral do projeto
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    ignores: ['node_modules/**', 'coverage/**', 'reports/**', 'dist/**'],
  },

  // Regras específicas para testes (Jest)
  {
    files: ['**/*.test.js', '__tests__/**/*.js'],
    plugins: { jest },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-conditional-expect': 'error',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error',
      'jest/consistent-test-it': ['warn', { fn: 'it' }],
      // adicionar mais se quiser:
      // 'jest/no-commented-out-tests': 'warn',
      // 'jest/prefer-to-be': 'warn',
    },
  },
];