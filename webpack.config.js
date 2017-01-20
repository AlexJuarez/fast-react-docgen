const webpack = require('webpack');

module.exports = {
  output: {
    path: __dirname,
    filename: 'main.bundle.js',
    publicPath: '/public/',
  },
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    loaders: [{
      test: /\.json$/,
      loaders: ['json-loader'],
    }, {
      test: /(\.jsx|\.js)?$/,
      loaders: ['babel?cacheDirectory'],
      exclude: [/node_modules/]
    }],
  },
  cache: true
};
