const fs = require('fs');
const path = require('path');

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

const getDocs = (src, path) => {
  try {
    return docgen.parse(src);
  } catch (err) {
    log.debug(path, err.message);
    log.warn(err.stack);
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

module.exports = (filePath, { cwd }) => {
  const { components, mtime } = getDependencies(filePath, cwd);

  components.forEach((componentPath) => {
    getCache(componentPath, () => {
      const src = fs.readFileSync(componentPath, { encoding: 'utf8' });
      return getDocs(src, componentPath);
    });
  });

  fs.writeFileSync(CACHE_PATH, JSON.stringify(imports));

  const output = {};

  components.forEach((componentPath) => {
    output[path.parse(componentPath).name] = imports[componentPath].data;
  });

  output._mtime = mtime.getTime();

  return output;
};
