const path = require('path');

const entry = [
  'react-hot-loader/patch',
  'webpack-hot-middleware/client',
  path.resolve(__dirname, '..', '..', './src/index.jsx'),
];

module.exports = entry;
