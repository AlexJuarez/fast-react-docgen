const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const cache = require('./docgen/cache');
const logger = require('./util/logger');
const log = logger.create('webpack');

module.exports = (app, config) => {
  const compiler = webpack(config);

  compiler.plugin('done', (stats) => {
    cache.set(stats.hash);
  });

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    hot: true,
    historyApiFallback: true,
    publicPath: config.output.publicPath,
    stats: { colors: true },
  }));

  app.use(webpackHotMiddleware(compiler, {
    log: (...args) => log.debug(...args),
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  }));
};
