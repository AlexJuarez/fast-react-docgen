const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

const demos = glob.sync('../TXL_components/src/**/*.demo.jsx', { absolute: true });

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
    alias: {
      txl: path.resolve(__dirname, '..', 'TXL_components', 'src'),
    },
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
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
    rules: [
      {
        test: /\.json$/,
        use: [{
          loader: 'json-loader',
        }]
      },
      {
        test: /(\.jsx|\.js)?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          }
        }],
        include: /src/
      },
      {
        test: /\.demo\.jsx/,
        use: [{
          loader: path.resolve(__dirname, './webpack/custom-loader.js'),
        }, {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            extends: path.resolve(__dirname, '.babelrc.demo')
          }
        }],
        include: demos
      }
    ]
  },
  cache: true
};
