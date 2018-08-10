module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  rules: {
    'no-console': 'off',
    'semi': [
      'error', 'never', { 'beforeStatementContinuationChars': 'always' }
    ],
    'semi-style': ['error', 'first'],
    'no-trailing-spaces': 'error',
    'space-before-function-paren': 'error',
    'space-before-blocks': 'error',
    'keyword-spacing': 'error'
  },
  root: true,

  overrides: {
    files: [
      '*.test.js'
    ],
    env: {
      jest: true
    }
  }
}
