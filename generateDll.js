const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const config = require('./webpack.dll');
const log = require('./server/util/logger').create('generate-dll');

module.exports = (opts = {}) => {
  const outputPath = path.resolve(__dirname, config.output.path, 'vendor-manifest.json');

  if (!fs.existsSync(outputPath) || opts.force) {
    log.info('generating a new vendor dll');
    webpack(config).run((err, stats) => {
      log.debug(stats.toString({ colors: true }));
    });
  } else {
    log.info('vendor dll found.');
  }
};
