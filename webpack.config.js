const path = require('path');
const webpack = require('webpack');

module.exports = {
  output: {
    path: __dirname,
    filename: 'main.bundle.js',
    publicPath: '/public/',
  },
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(__dirname, 'src'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./public/dll/vendor-manifest.json')
    })
  ],
  module: {
    loaders: [{
      test: /\.json$/,
      loaders: ['json-loader'],
    }, {
      test: /(\.jsx|\.js)?$/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
      },
      include: [/src/],
      exclude: [/node_modules/]
    }],
  },
  cache: true
};
