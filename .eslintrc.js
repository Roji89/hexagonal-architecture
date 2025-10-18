module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: [
    '.eslintrc.js',
    'dist/',
    'node_modules/',
    '**/*.js',
    'coverage/',
    '*.config.js'
  ],
  rules: {
    // Basic rules that work without TypeScript preset
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'off', // Turn off in favor of TypeScript rule
    'prefer-const': 'error',
    'no-var': 'error',

    // TypeScript rules (basic ones that should work)
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
