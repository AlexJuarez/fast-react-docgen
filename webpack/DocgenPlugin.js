const fs = require('fs-extra');
const path = require('path');

const log = require('./../server/util/logger').create('docgen-plugin');
const Cache = require('./../server/docgen/cache');

const DEV_MODE = (process.env.NODE_ENV !== 'production');

class DocgenPlugin {
  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('after-optimize-module-ids', (modules) => {
        Cache.setModules(modules);
      });
    });

    compiler.plugin('done', (stats) => {
      const start = new Date();
      Cache.set().then(() => {
        log.info(`cache built in ${new Date() - start} ms`);
        log.debug(stats.toString({ colors: true }));
        if (!DEV_MODE) {
          const cache = Cache.get();
          if (!DEV_MODE) {
            Object.keys(cache).forEach((key) => {
              cache[key].then((data) => {
                const outputPath = path.resolve(__dirname, '..', 'public', `${key}.json`);
                fs.outputFileSync(outputPath, JSON.stringify(data, null, ' '));
              });
            });
          }
        }
      });
    });
  }
}

module.exports = DocgenPlugin;
