module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
  rules: { 'prettier/prettier': ['error', { endOfLine: 'crlf' }] },
  env: {
    node: true,
    es2021: true,
  },
  globals: {
    $: 'readonly',
    codeceptjs: 'readonly',
    document: 'readonly',
    Feature: 'readonly',
    frames: 'readonly',
    inject: 'readonly',
    MutationObserver: 'readonly',
    pause: 'readonly',
    Scenario: 'readonly',
    secret: 'readonly',
    session: 'readonly',
    tags: 'writable',
    tryTo: 'writable',
    window: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
}
