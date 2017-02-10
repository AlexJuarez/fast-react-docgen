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

const extCache = {};
const ext = (filePath) => {
  if (extCache[filePath]) {
    return extCache[filePath];
  }

  const result = fs.existsSync(`${filePath}.jsx`) ? `${filePath}.jsx` : `${filePath}.js`;
  extCache[filePath] = result;

  return result;
};

module.exports = (filePath, opts) => {
  const components = [];
  const resolver = Resolver(opts.cwd);
  const parser = require('./parser/babylon');
  const j = jscodeshift.withParser(parser);

  const source = fs.readFileSync(filePath, { encoding: 'utf8' });

  let { mtime } = fs.statSync(filePath);
  j(source)
    .find(j.ImportDeclaration)
    .forEach((p) => {
      const name = p.value.source.value;
      const resolvedName = resolver.resolve(name) || name;
      const type = resolver.type(name, resolvedName);
      const fullPath = resolver.isAbsolute(resolvedName) ?
        resolvedName :
        ext(path.resolve(path.dirname(filePath), resolvedName));

      if (type !== 'external') {
        const mtime2 = fs.statSync(require.resolve(fullPath)).mtime;

        if (mtime < mtime2) {
          mtime = mtime2;
        }
      }

      if (type === 'sibling') {
        components.push(fullPath);
      }
    });


  components.forEach((componentPath) => {
    getCache(componentPath, () => {
      const src = fs.readFileSync(componentPath, { encoding: 'utf8' });
      return getDocs(src);
    });
  });

  fs.writeFileSync(CACHE_PATH, JSON.stringify(imports));

  const output = {};

  components.forEach((componentPath) => {
    output[path.parse(componentPath).name] = imports[componentPath].data;
  });

  output._mtime = mtime;

  return output;
};
