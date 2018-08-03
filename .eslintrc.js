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
    'no-console': 'off'
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
