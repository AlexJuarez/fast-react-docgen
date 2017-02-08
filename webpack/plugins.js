const path = require('path');
const os = require('os');

const webpack = require('webpack');
const HappyPack = require('happypack');

const WebpackHtmlPlugin = require('html-webpack-plugin');
const DocgenPlugin = require('./DocgenPlugin');

const threadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const DEV_MODE = (process.env.NODE_ENV !== 'production');
const tempDir = path.resolve(__dirname, '..', '.happypack');
const babelrc = path.resolve(__dirname, '..', '.babelrc');

const HAPPYPACK_DEFAULTS = {
  cacheContext: {
    env: DEV_MODE ? 'development' : 'production',
  },
  tempDir,
  threadPool,
};

const HappyPackLoader = (id, loaders) =>
  new HappyPack(Object.assign({ id, loaders }, HAPPYPACK_DEFAULTS));

const plugins = [
  new WebpackHtmlPlugin({
    title: 'TXL Interactive Documentation',
    filename: 'index.html',
    template: 'src/index.ejs',
    vendor: DEV_MODE,
  }),
  new webpack.NamedModulesPlugin(),
  HappyPackLoader('jsx', ['babel-loader?cacheDirectory']),
  HappyPackLoader('demo', [
    path.resolve(__dirname, './custom-loader.js'),
    `babel-loader?cacheDirectory&extends=${babelrc}`,
  ]),
  HappyPackLoader('json', ['json-loader']),
  HappyPackLoader('css', ['style-loader', 'css-loader']),
  new DocgenPlugin(),
];

const getPlugins = () => {
  if (DEV_MODE) {
    return plugins.concat(require('./dev/plugins'));
  }

  return plugins.concat(require('./prod/plugins'));
};

module.exports = getPlugins();
