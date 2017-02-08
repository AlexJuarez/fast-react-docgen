const path = require('path');
const fs = require('fs');

const webpack = require('webpack');

const log = require('./../server/util/logger').create('generate-dll');

const ROOTS = {};
const findRoot = (filePath) => {
  if (ROOTS[filePath] != null) {
    return ROOTS[filePath];
  }

  let root = path.dirname(filePath);
  while (root.length > 1 && !fs.existsSync(path.resolve(root, 'package.json'))) {
    root = path.dirname(root);
  }

  ROOTS[filePath] = root;
  return root;
};

const shouldUpdateDll = (outputPath) => {
  const pkg = path.resolve(findRoot(require.main.filename), 'package.json');

  return !fs.existsSync(outputPath)
    || (fs.existsSync(pkg) && fs.statSync(pkg).mtime > fs.statSync(outputPath).mtime);
};

module.exports = (force = false, done = (() => null)) => {
  const config = require('./../webpack.dll.js');
  const outputPath = path.resolve(config.output.path, 'vendor-manifest.json');

  if (shouldUpdateDll(outputPath) || force) {
    log.info('generating a new vendor dll');
    webpack(config).run((err, stats) => {
      log.debug(stats.toString({ colors: true }));
      done();
    });
  } else {
    log.info('vendor dll found.');
    done();
  }
};
