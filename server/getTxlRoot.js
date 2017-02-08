const fs = require('fs');
const path = require('path');

const logger = require('./util/logger');

const log = logger.create('runner');

/* eslint import/no-dynamic-require: off */

const getTxlRoot = () => {
  const root = path.resolve(__dirname, '..');
  const defaultPaths = ['../TXL_components', path.relative(process.cwd(), root), path.relative(
    path.dirname(require.main.filename), root)];
  const found = defaultPaths.filter((p) => {
    const pkgPath = path.resolve(p, 'package.json');
    return fs.existsSync(pkgPath) && require(pkgPath).name === 'txl-builder';
  });

  if (found.length) {
    return found.pop();
  }

  log.error('TXL root path could not be found.');
  throw new Error('TXL root could not be found.');
};

module.exports = getTxlRoot;