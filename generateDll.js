const path = require('path');
const fs = require('fs');

const webpack = require('webpack');

const config = require('./webpack.dll');
const log = require('./server/util/logger').create('generate-dll');

const findRoot = (filePath) => {
  let root = path.dirname(filePath);
  while (root.length > 1 && !fs.existsSync(path.resolve(root, 'package.json'))) {
    root = path.dirname(root);
  }

  return root;
};

module.exports = (opts = {}) => {
  const outputPath = path.resolve(__dirname, config.output.path, 'vendor-manifest.json');
  const root = findRoot(require.main.filename);
  const pkg = path.resolve(root, 'package.json');

  if (!fs.existsSync(outputPath)
    || (fs.existsSync(pkg) && fs.statSync(pkg).mtime > fs.statSync(outputPath).mtime)
    || opts.force) {
    log.info('generating a new vendor dll');
    return new Promise((resolve) => {
      webpack(config).run((err, stats) => {
        log.debug(stats.toString({ colors: true }));
        resolve();
      });
    });
  }

  log.info('vendor dll found.');
  return Promise.resolve();
};
