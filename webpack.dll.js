const path = require('path');
const webpack = require('webpack');

module.exports = {
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
    root: path.resolve(__dirname, 'src'),
    modulesDirectories: ['node_modules']
  }
};