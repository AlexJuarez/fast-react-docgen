const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
    vendor: [path.join(__dirname, 'src', 'vendors.js')]
  },
  output: {
    path: path.join(__dirname, 'public', 'dll'),
    filename: 'dll.[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'public', 'dll', '[name]-manifest.json'),
      name: '[name]',
      context: '.'
    })
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules'), 'node_modules'],
  }
};