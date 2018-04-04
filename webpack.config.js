/* eslint sort-keys: off */

const path = require('path');

const txlRoot = require('./server/getPkgRoot');

const DEV_MODE = (process.env.NODE_ENV !== 'production');

const fileName = DEV_MODE ? '[name].bundle.js' : 'js/[name].bundle.js';
const publicPath = DEV_MODE ? '/public/' : '';

module.exports = {
  context: __dirname,
  output: {
    path: path.join(__dirname, 'public'),
    filename: fileName,
    publicPath: publicPath,
    chunkFilename: fileName,
  },
  devtool: 'eval',
  entry: require('./webpack/entry'),
  resolve: {
    alias: {
      txl: path.join(txlRoot(), 'src'),
    },
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), path.resolve(process.cwd(), 'node_modules'), 'node_modules'],
  },
  plugins: require('./webpack/plugins'),
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
};
