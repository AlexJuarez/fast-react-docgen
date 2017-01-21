const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const fs = new MemoryFS();
const path = require('path');
const log = require('./../util/logger').create('get-file');

const ROOT = path.resolve(__dirname, '..', '..');

const getConfig = (filename) => ({
  output: {
    path: ROOT,
    filename: 'main.bundle.js',
    publicPath: '/public/',
  },
  entry: filename,
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(ROOT, 'src'),
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: '../TXL_components',
      manifest: require('../../public/dll/vendor-manifest.json')
    }),
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
      exclude: [/node_modules/]
    }, {
      test: /\.demo\.jsx/,
      loaders: [
        path.resolve(ROOT, './webpack/custom-loader.js'),
        'babel-loader?cacheDirectory&extends=' +
        path.resolve(ROOT, '.babelrc.demo')
      ]
    }]
  }
});

module.exports = (filename) => {
  const compiler = webpack(getConfig(filename));
  compiler.outputFileSystem = fs;
  return new Promise(resolve => {
    compiler.run((err, stats) => {
      log.debug(`file: ${filename} compiled in ${stats.endTime - stats.startTime} ms`);
      resolve(fs.readFileSync(path.join(ROOT, 'main.bundle.js')));
    });
  });
}