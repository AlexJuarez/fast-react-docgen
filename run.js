const path = require('path');
const open = require('open');

const Server = require('./server');
const logger = require('./server/util/logger');
const generateDll = require('./generateDll');
const createDemoMap = require('./server/util/createDemoMap');

const TXL_ROOT = path.resolve('../TXL_components');

const Run = (config) => {
  logger.setup(config.logLevel, true);

  generateDll();
  createDemoMap({ cwd: TXL_ROOT, demoExt: config.demoExt });

  const server = new Server({
    cwd: TXL_ROOT,
    demoExt: config.demoExt,
    port: config.port,
    showStats: config.showStats
  });

  server.on('ready', () => {
    open(`http://0.0.0.0:${config.port}`);
  });

  server.start();
};

module.exports = Run;
