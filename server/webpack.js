const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const cache = require('./docgen/cache');
const logger = require('./util/logger');

const log = logger.create('webpack');

module.exports = (app) => {
  const webpackConfig = require('../webpack.config');
  const compiler = webpack(webpackConfig);

  log.info('webpack compiler started');

  const getIndex = () => {
    const filePath = path.join(compiler.outputPath, 'index.html');
    const fs = compiler.outputFileSystem;
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    }

    return '<script>setTimeout(function(){ location.reload(); }, 500);</script>';
  };

  return new Promise((resolve) => {
    compiler.plugin('done', () => {
      resolve();
    });

    app.use(webpackDevMiddleware(compiler, {
      historyApiFallback: true,
      hot: true,
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      stats: { colors: true },
    }));

    app.use(webpackHotMiddleware(compiler, {
      heartbeat: 10 * 1000,
      log: (...args) => log.info(...args),
      path: '/__webpack_hmr',
    }));

    app.get('/', (req, res) => {
      res.set('content-type', 'text/html');
      res.send(getIndex().toString());
      res.end();
    });

    app.get('/components/*', (req, res) => {
      res.set('content-type', 'text/html');
      res.send(getIndex().toString());
      res.end();
    });
  });
};
