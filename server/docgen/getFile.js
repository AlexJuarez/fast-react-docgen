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
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: '../TXL_components',
      manifest: require('../../public/dll/vendor-manifest.json')
    }),
  ],
  module: {
    rules: [{
      test: /(\.jsx|\.js)?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      }],
      include: [/src/]
    }, {
      test: /\.demo\.jsx/,
      use: [{
        loader: path.resolve(ROOT, './webpack/custom-loader.js'),
      }, {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          extends: path.resolve(ROOT, '.babelrc.demo')
        }
      }],
      include: [/src/]
    }]
  }
});

module.exports = (filename) => {
  try {
    webpack(getConfig(filename));
  } catch (err) {
    log.error(err);
  }
  const compiler = webpack(getConfig(filename));
  compiler.outputFileSystem = fs;
  return new Promise(resolve => {
    compiler.run((err, stats) => {
      log.debug(`file: ${filename} compiled in ${stats.endTime - stats.startTime} ms`);
      require('fs').writeFileSync(path.resolve(process.cwd(), 'stats.json'), JSON.stringify(stats.toJson('verbose'), null, ' '));
      resolve(fs.readFileSync(path.join(ROOT, 'main.bundle.js')));
    });
  });
}