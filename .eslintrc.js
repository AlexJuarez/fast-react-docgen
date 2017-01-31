const path = require('path');

module.exports = {
  extends: 'tune',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: [
    'flowtype',
    'import',
    'react'
  ],
  rules: {
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never'
    }],
    'no-duplicate-imports': 'off',
    // eslint-plugin-react/require-extension takes care of this rule
    'import/extensions': 'off'
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.eslint.js'
      }
    },
    'babel-module': {},
  }
};
