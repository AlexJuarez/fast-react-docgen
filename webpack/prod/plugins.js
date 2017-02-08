const webpack = require('webpack');

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: module => module.resource && module.resource.indexOf('node_modules') !== -1,
    filename: 'vendor.bundle.js',
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      drop_console: false,
      warnings: false,
    },
    minimize: true,
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.EnvironmentPlugin(['NODE_ENV']),
];

module.exports = plugins;
