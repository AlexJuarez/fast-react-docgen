/* eslint sort-keys: off */

const path = require('path');
const os = require('os');

const webpack = require('webpack');
const HappyPack = require('happypack');
const threadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const tempDir = path.resolve(__dirname, '.happypack');

module.exports = ({ cwd }) => ({
  context: path.resolve(__dirname),
  output: {
    path: __dirname,
    filename: 'main.bundle.js',
    publicPath: '/public/',
  },
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    path.resolve(__dirname, './src/index.jsx'),
  ],
  resolve: {
    alias: {
      txl: path.resolve(cwd, 'src'),
    },
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), path.resolve(process.cwd(), 'node_modules'), 'node_modules'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./public/dll/vendor-manifest.json'),
    }),
    new webpack.DllReferencePlugin({
      context: path.relative(__dirname, cwd),
      manifest: require('./public/dll/vendor-manifest.json'),
    }),
    new HappyPack({
      id: 'jsx',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool,
      tempDir,
    }),
    new HappyPack({
      id: 'demo',
      loaders: [
        path.resolve(__dirname, './webpack/custom-loader.js'),
        `babel-loader?cacheDirectory&extends=${path.resolve(__dirname, '.babelrc.demo')}`,
      ],
      threadPool,
      tempDir,
    }),
    new HappyPack({
      id: 'json',
      loaders: ['json-loader'],
      threadPool,
      tempDir,
    }),
    new HappyPack({
      id: 'css',
      loaders: ['style-loader', 'css-loader'],
      threadPool,
      tempDir,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [{
          loader: 'happypack/loader?id=json',
        }],
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'happypack/loader?id=css',
        }],
      },
      {
        test: /(\.jsx|\.js)?$/,
        use: [{
          loader: 'happypack/loader?id=jsx',
        }],
        include: /src/,
        exclude: [/\.demo\.jsx/, /node_modues/, /\.css/],
      },
      {
        test: /\.demo\.jsx/,
        use: [{
          loader: 'happypack/loader?id=demo',
        }],
        exclude: [/node_modules/],
      },
    ],
  },
  cache: true,
});
