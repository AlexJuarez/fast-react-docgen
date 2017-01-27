const path = require('path');
const open = require('open');
const fs = require('fs');

const Server = require('./server');
const logger = require('./server/util/logger');
const generateDll = require('./generateDll');
const createDemoMap = require('./server/util/createDemoMap');
const log = logger.create('runner');

const getTxlRoot = () => {
  const defaultPaths = ['../TXL_components', process.cwd()];
  const found = defaultPaths.filter(p => {
    const dirPath = path.resolve(p);
    return path.basename(dirPath) === 'TXL_components' &&
      fs.existsSync(dirPath);
  });

  if (found.length) {
    return found.pop();
  } else {
    log.error('TXL root path could not be found.');
    process.exit();
  }
};

const TXL_ROOT = getTxlRoot();

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
