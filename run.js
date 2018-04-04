const path = require('path');
const logger = require('./server/util/logger');
const getPkgRoot = require('./server/getPkgRoot');

const DEV_MODE = (process.env.NODE_ENV !== 'production');

const resolvePath = (file) => path.isAbsolute(file) ? path.resolve(file) : path.resolve(process.cwd(), file);

const Run = (file, config) => {
  logger.setup(config.logLevel, true);
  const fp = resolvePath(file);
  const PKG_ROOT = getPkgRoot(fp);

  const Start = () => {
    const Server = require('./server');

    const server = new Server({
      root: PKG_ROOT,
      file: './' + path.relative(PKG_ROOT, fp),
      port: config.port,
      showStats: config.showStats,
    });

    server.start();
  };

  Start();
};

module.exports = Run;
