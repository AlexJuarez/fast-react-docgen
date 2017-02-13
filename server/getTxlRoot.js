const fs = require('fs');
const path = require('path');

const logger = require('./util/logger');

const log = logger.create('txl-root');

/* eslint import/no-dynamic-require: off */

let TXL_ROOT = null;

const findTxlRoot = (filePath) => {
  let root = path.dirname(filePath);
  while (root.length > 1) {
    const pkgPath = path.resolve(root, 'package.json');
    if (fs.existsSync(pkgPath) && ['txl-builder', 'txl']
        .indexOf(require(pkgPath).name) !== -1) {
      return root;
    }
    root = path.dirname(root);
  }

  return root;
};

const getTxlRoot = () => {
  if (TXL_ROOT != null) {
    return TXL_ROOT;
  }

  const defaultPaths = [
    path.resolve('..', 'TXL_components'), // relative
    process.cwd(), // at process
    path.dirname(require.main.filename), // at execution location
    findTxlRoot(path.resolve(__dirname)), // txl-docs is in node modules
  ];

  log.debug(`Checking defaultPaths: ${defaultPaths.join(', ')}`);
  const found = defaultPaths.filter((p) => {
    const pkgPath = path.resolve(p, 'package.json');
    return fs.existsSync(pkgPath) && require(pkgPath).name === 'txl-builder';
  });

  if (found.length) {
    TXL_ROOT = found.pop();
    log.info(`Path: ${TXL_ROOT}`);
    return TXL_ROOT;
  }

  log.error('Path could not be found.');
  return null;
};

const relative = () => {
  const root = path.resolve(__dirname, '..');
  const relativePath = path.relative(root, getTxlRoot());

  log.debug(`Relative: ${relativePath}`);
  return relativePath;
};

module.exports = getTxlRoot;
module.exports.relative = relative;
