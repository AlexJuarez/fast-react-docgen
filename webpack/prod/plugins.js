const webpack = require('webpack');

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    filename: 'js/vendor.bundle.js',
    minChunks: module => module.resource && module.resource.indexOf('node_modules') !== -1,
    name: 'vendor',
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      drop_console: false,
      warnings: false,
    },
    minimize: true,
  }),
  new webpack.LoaderOptionsPlugin({
    debug: false,
    minimize: true,
  }),
  new webpack.EnvironmentPlugin(['NODE_ENV']),
];

module.exports = plugins;
