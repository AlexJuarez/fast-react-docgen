const fs = require('fs-extra');
const path = require('path');

const log = require('./../server/util/logger').create('docgen-plugin');
const Cache = require('./../server/docgen/cache');

const DEV_MODE = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV == null);

class DocgenPlugin {
  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('after-optimize-module-ids', (modules) => {
        Cache.setModules(modules);
      });
    });

    compiler.plugin('emit', (compilation, done) => {
      const start = new Date();
      Cache.set().then(() => {
        log.info(`cache built in ${new Date() - start} ms`);
        if (!DEV_MODE) {
          const cache = Cache.get();
          if (!DEV_MODE) {
            Object.keys(cache).forEach((key) => {
              cache[key].then((data) => {
                const mapKey = (k) => {
                  if (k === 'navItems') {
                    return 'nav';
                  }

                  return k;
                };

                const outputPath = path.resolve(__dirname, '..', 'public', 'api', `${mapKey(key)}`);
                fs.outputFileSync(outputPath, JSON.stringify(data, null, ' '));
              });
            });
          }
        }
        done();
      });
    });

    compiler.plugin('done', (stats) => {
      log.debug(stats.toString({ colors: true }));
    });
  }
}

module.exports = DocgenPlugin;
