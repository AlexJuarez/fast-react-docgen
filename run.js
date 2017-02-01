const fs = require('fs');
const path = require('path');

const open = require('open');

const Server = require('./server');
const logger = require('./server/util/logger');
const generateDll = require('./generateDll');
const createDemoMap = require('./server/util/createDemoMap');

const log = logger.create('runner');

/* eslint import/no-dynamic-require: off, consistent-return: off */
const getTxlRoot = () => {
  const defaultPaths = ['../TXL_components', path.relative(__dirname, process.cwd()), path.relative(__dirname,
    path.dirname(require.main.filename))];
  const found = defaultPaths.filter((p) => {
    const pkgPath = path.resolve(p, 'package.json');
    return fs.existsSync(pkgPath) && require(pkgPath).name === 'txl-builder';
  });

  if (found.length) {
    return found.pop();
  }

  log.error('TXL root path could not be found.');
  process.exit();
};

const Run = (config) => {
  logger.setup(config.logLevel, true);

  const TXL_ROOT = getTxlRoot();
  log.debug(`found txl: ${TXL_ROOT}`);

  generateDll().then(() => {
    createDemoMap({ cwd: TXL_ROOT, demoExt: config.demoExt });

    const server = new Server({
      cwd: TXL_ROOT,
      demoExt: config.demoExt,
      port: config.port,
      showStats: config.showStats,
    });

    server.on('ready', () => {
      open(`http://0.0.0.0:${config.port}`);
    });

    server.start();
  });
};

module.exports = Run;
