/* eslint sort-keys: off */

const path = require('path');

const webpack = require('webpack');

const vendorManifest = require('./public/dll/vendor-manifest.json');

module.exports = ({ cwd }) => ({
  context: __dirname,
  output: {
    path: __dirname,
    filename: 'main.bundle.js',
    publicPath: '/public/',
  },
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './src/index.jsx',
  ],
  resolve: {
    alias: {
      txl: path.resolve(cwd, 'src'),
    },
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: vendorManifest,
    }),
    new webpack.DllReferencePlugin({
      context: path.relative(__dirname, cwd),
      manifest: vendorManifest,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [{
          loader: 'json-loader',
        }],
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }],
      },
      {
        test: /(\.jsx|\.js)?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }],
        include: /src/,
        exclude: [/\.demo\.jsx/, /node_modues/],
      },
      {
        test: /\.demo\.jsx/,
        use: [{
          loader: path.resolve(__dirname, './webpack/custom-loader.js'),
        }, {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            extends: path.resolve(__dirname, '.babelrc.demo'),
          },
        }],
        exclude: [/node_modules/],
      },
    ],
  },
  cache: true,
});
