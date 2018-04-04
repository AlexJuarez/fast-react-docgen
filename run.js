const logger = require('./server/util/logger');
const getPkgRoot = require('./server/getPkgRoot');

const DEV_MODE = (process.env.NODE_ENV !== 'production');

const Run = (file, config) => {
  logger.setup(config.logLevel, true);
  const PKG_ROOT = getPkgRoot(file);

  const Start = () => {
    const Server = require('./server');

    const server = new Server({
      root: PKG_ROOT,
      file,
      port: config.port,
      showStats: config.showStats,
    });

    server.start();
  };

  Start();
};

module.exports = Run;
