const path = require('path');

const webpack = require('webpack');

module.exports = {
  context: process.cwd(),
  entry: {
    vendor: [path.join(__dirname, 'src', 'vendors.js')],
  },
  output: {
    filename: '[name].bundle.js',
    library: '[name]',
    path: path.join(__dirname, 'public'),
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
    modules: [path.join(__dirname, 'src'), path.resolve(process.cwd(), 'node_modules'), path.resolve(__dirname, 'node_modules')],
  },
};
