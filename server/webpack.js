const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const cache = require('./docgen/cache');
const logger = require('./util/logger');
const webpackConfig = require('../webpack.config');
const log = logger.create('webpack');

module.exports = (app, config) => {
  const wpc = webpackConfig(config);
  const compiler = webpack(wpc);

  log.info('webpack compiler started');

  compiler.plugin('done', (stats) => {
    const start = new Date();
    cache.set(stats.hash, config);
    log.info(`cache built in ${new Date() - start} ms`);
    log.debug(stats.toString({ colors: true }));
  });

  app.use(webpackDevMiddleware(compiler, {
    historyApiFallback: true,
    hot: true,
    noInfo: true,
    publicPath: wpc.output.publicPath,
    stats: { colors: true },
  }));

  app.use(webpackHotMiddleware(compiler, {
    heartbeat: 10 * 1000,
    log: (...args) => log.info(...args),
    path: '/__webpack_hmr',
  }));
};
