const navItems = require('./navItems');
const parseImports = require('./parseImports');
const parseModules = require('./parse-modules');
const convertPath = require('./convertPath');
const getPkgRoot = require('./../getPkgRoot');

const cache = {
  imports: Promise.resolve(),
  modules: Promise.resolve(),
  navItems: Promise.resolve(),
};

const set = (demoExt = '.demo.jsx') => {
  const opts = { cwd: getPkgRoot(), demoExt };

  cache.navItems = new Promise((resolve) => {
    resolve(navItems(`src/**/*${demoExt}`, opts));
  });

  cache.imports = new Promise((resolve) => {
    cache.navItems.then((items) => {
      const imports = {};
      items.files.forEach((f) => {
        const fullPath = convertPath.expandPath(f.path);
        imports[f.id] = parseImports(fullPath, opts);
      });
      resolve(imports);
    });
  });

  return Promise.all([cache.navItems, cache.imports]);
};

const setModules = (modules) => {
  cache.modules = new Promise((resolve) => {
    resolve(parseModules(modules, getPkgRoot()));
  });
};

const get = () => cache;

module.exports = {
  get,
  set,
  setModules,
};
