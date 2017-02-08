const path = require('path');

module.exports = {
  extends: 'tune',
  parser: 'babel-eslint',
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
    'import/extensions': 'off',
    'no-plusplus': 'off',
    'default-case': 'off',
    'global-require': 'off',
    'import/no-unresolved': [2, { ignore: ['txl'] }],
    'react/prop-types': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, 'webpack.config.js')
      }
    },
    'import/extensions': ['.js', '.jsx']
  }
};
