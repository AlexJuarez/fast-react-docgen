const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const cache = require('./docgen/cache');
const logger = require('./util/logger');

const log = logger.create('webpack');
const DEV_MODE = (process.env.NODE_ENV !== 'production');

module.exports = (app, config) => {
  const webpackConfig = require('../webpack.config');
  const wpc = webpackConfig(config);
  const compiler = webpack(wpc);

  log.info('webpack compiler started');

  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('after-optimize-module-ids', (modules) => {
      cache.setModules(modules, config);
    });
  });

  compiler.plugin('done', (stats) => {
    const start = new Date();
    cache.set(stats.hash, config);
    log.info(`cache built in ${new Date() - start} ms`);
    log.debug(stats.toString({ colors: true }));
  });

  if (DEV_MODE) {
    app.use(webpackDevMiddleware(compiler, {
      historyApiFallback: true,
      hot: true,
      noInfo: true,
      publicPath: '/',
      stats: { colors: true },
    }));

    app.use(webpackHotMiddleware(compiler, {
      heartbeat: 10 * 1000,
      log: (...args) => log.info(...args),
      path: '/__webpack_hmr',
    }));

    return Promise.resolve();
  }

  return new Promise((resolve) => {
    compiler.run((err, stats) => {
      log.info(stats.toString({ colors: true }));
      resolve();
    });
  });
};
