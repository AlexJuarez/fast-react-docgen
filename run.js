const open = require('open');

const logger = require('./server/util/logger');
const generateDll = require('./webpack/generateDll');
const createDemoMap = require('./server/util/createDemoMap');
const getTxlRoot = require('./server/getTxlRoot');

const DEV_MODE = (process.env.NODE_ENV !== 'production');

/* eslint import/no-dynamic-require: off, consistent-return: off */

const Run = (config) => {
  logger.setup(config.logLevel, true);
  const TXL_ROOT = getTxlRoot();

  const Start = () => {
    const Server = require('./server');

    createDemoMap({ cwd: TXL_ROOT, demoExt: config.demoExt });

    const server = new Server({
      cwd: TXL_ROOT,
      demoExt: config.demoExt,
      port: config.port,
      showStats: config.showStats,
    });

    if (DEV_MODE) {
      server.on('ready', () => {
        open(`http://0.0.0.0:${config.port}`);
      });
    }

    server.start();
  };

  if (DEV_MODE) {
    generateDll(false, Start);
  } else {
    Start();
  }
};

module.exports = Run;
