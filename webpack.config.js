/* eslint sort-keys: off */

const path = require('path');
const os = require('os');

const webpack = require('webpack');
const HappyPack = require('happypack');
const WebpackHtmlPlugin = require('html-webpack-plugin');

const threadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const DEV_MODE = (process.env.NODE_ENV !== 'production');
const tempDir = path.resolve(__dirname, '.happypack');

const getEntries = () => {
  if (DEV_MODE) {
    return [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      path.resolve(__dirname, './src/index.jsx'),
    ];
  }

  return [path.resolve(__dirname, './src/index.prod.jsx')];
};

const getPlugins = (cwd) => {
  const plugins = [
    new WebpackHtmlPlugin({
      title: 'TXL Interactive Documentation',
      template: 'src/index.ejs',
      vendor: DEV_MODE,
    }),
    new webpack.NamedModulesPlugin(),
    new HappyPack({
      cacheContext: {
        env: DEV_MODE ? 'development' : 'production',
      },
      id: 'jsx',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool,
      tempDir,
    }),
    new HappyPack({
      cacheContext: {
        env: DEV_MODE ? 'development' : 'production',
      },
      id: 'demo',
      loaders: [
        path.resolve(__dirname, './webpack/custom-loader.js'),
        `babel-loader?cacheDirectory&extends=${path.resolve(__dirname, '.babelrc.demo')}`,
      ],
      threadPool,
      tempDir,
    }),
    new HappyPack({
      cacheContext: {
        env: DEV_MODE ? 'development' : 'production',
      },
      id: 'json',
      loaders: ['json-loader'],
      threadPool,
      tempDir,
    }),
    new HappyPack({
      cacheContext: {
        env: DEV_MODE ? 'development' : 'production',
      },
      id: 'css',
      loaders: ['style-loader', 'css-loader'],
      threadPool,
      tempDir,
    }),
  ];

  if (DEV_MODE) {
    plugins.push(...[
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: require('./public/dll/vendor-manifest.json'),
      }),
      new webpack.DllReferencePlugin({
        context: path.relative(__dirname, cwd),
        manifest: require('./public/dll/vendor-manifest.json'),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ]);

    return plugins;
  }

  plugins.push(...[
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
  ]);

  return plugins;
};

module.exports = ({ cwd }) => ({
  context: __dirname,
  output: {
    path: path.join(__dirname),
    filename: path.join('public', '[name].bundle.js'),
    publicPath: '/',
    chunkFilename: path.join('public', '[name].bundle.js'),
  },
  devtool: 'eval',
  entry: getEntries(),
  resolve: {
    alias: {
      txl: path.resolve(cwd, 'src'),
    },
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), path.resolve(process.cwd(), 'node_modules'), 'node_modules'],
  },
  plugins: getPlugins(cwd),
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
        test: /(\.jsx|\.js)$/,
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
