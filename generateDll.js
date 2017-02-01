const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const config = require('./webpack.dll');
const log = require('./server/util/logger').create('generate-dll');

module.exports = (opts = {}) => {
  const outputPath = path.resolve(__dirname, config.output.path, 'vendor-manifest.json');

  if (!fs.existsSync(outputPath) || opts.force) {
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
