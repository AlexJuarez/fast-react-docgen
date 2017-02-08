const fs = require('fs');
const path = require('path');

const logger = require('./util/logger');

const log = logger.create('runner');

/* eslint import/no-dynamic-require: off */

const getTxlRoot = () => {
  const root = path.resolve(__dirname, '..');
  const defaultPaths = ['../TXL_components', path.relative(root, process.cwd()), path.relative(root,
    path.dirname(require.main.filename))];
  const found = defaultPaths.filter((p) => {
    const pkgPath = path.resolve(root, p, 'package.json');
    return fs.existsSync(pkgPath) && require(pkgPath).name === 'txl-builder';
  });

  if (found.length) {
    return found.pop();
  }

  log.error('TXL root path could not be found.');
  throw new Error('TXL root could not be found.');
};

module.exports = getTxlRoot;
