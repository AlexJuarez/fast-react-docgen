const fs = require('fs');
const path = require('path');

const jscodeshift = require('jscodeshift');
const docgen = require('react-docgen');

const Resolver = require('./resolve-imports');
const logger = require('../util/logger');

const log = logger.create('parse-imports');

const CACHE_PATH = path.resolve(__dirname, '..', '..', '.docs.cache');

const getImports = () => {
  if (fs.existsSync(CACHE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_PATH));
    } catch (err) {
      log.debug(err.message);
    }
  }

  return {};
};

const imports = getImports();

const getDocs = (src) => {
  try {
    return docgen.parse(src);
  } catch (err) {
    log.debug(err.message);
  }

  return {};
};

const getCache = (key, fn) => {
  const stats = fs.statSync(key);
  if (imports[key] == null || imports[key].mtime < stats.mtime) {
    imports[key] = {
      data: fn(),
      file: key,
      mtime: stats.mtime,
    };
  }

  return imports[key].data;
};

module.exports = (filePath, opts) => {
  const components = getCache(filePath, () => {
    const output = [];
    const resolver = Resolver(opts.cwd);
    const parser = require('./parser/babylon');
    const j = jscodeshift.withParser(parser);

    const source = fs.readFileSync(filePath, { encoding: 'utf8' });

    j(source)
      .find(j.ImportDeclaration)
      .forEach((p) => {
        const name = p.value.source.value;
        const resolvedName = resolver.resolve(name) || name;
        const type = resolver.type(name, resolvedName);

        if (type === 'sibling') {
          output.push(path.resolve(path.dirname(filePath), resolvedName));
        }
      });

    return output;
  });

  const componentPaths = components.map(c => (
    fs.existsSync(`${c}.jsx`) ? `${c}.jsx` : `${c}.js`
  ));
  componentPaths.forEach((componentPath) => {
    getCache(componentPath, () => {
      const src = fs.readFileSync(componentPath, { encoding: 'utf8' });
      return getDocs(src);
    });
  });

  fs.writeFileSync(CACHE_PATH, JSON.stringify(imports));

  const output = {};

  componentPaths.forEach((componentPath) => {
    output[path.parse(componentPath).name] = imports[componentPath].data;
  });

  return output;
};
