const path = require('path');

const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
    vendor: [path.join(__dirname, 'src', 'vendors.js')]
  },
  output: {
    filename: 'dll.[name].js',
    library: '[name]',
    path: path.join(__dirname, 'public', 'dll'),
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DllPlugin({
      context: '.',
      name: '[name]',
      path: path.join(__dirname, 'public', 'dll', '[name]-manifest.json'),
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
};
