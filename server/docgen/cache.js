const path = require('path');

const navItems = require('./navItems');
const parseImports = require('./parseImports');
const parseModules = require('./parse-modules');
const convertPath = require('./convertPath');
const TXL_ROOT = require('./../getTxlRoot')();

const cache = {
  imports: Promise.resolve(),
  modules: Promise.resolve(),
  navItems: Promise.resolve(),
};

exports.set = (demoExt = '.demo.jsx') => {
  const TXL_SRC = path.join(TXL_ROOT, 'src');

  const opts = { cwd: path.resolve(TXL_ROOT), demoExt };
  cache.navItems = new Promise((resolve) => {
    resolve(navItems(`src/**/*${demoExt}`, opts));
  });

  cache.imports = new Promise((resolve) => {
    cache.navItems.then((items) => {
      const imports = {};
      items.files.forEach((f) => {
        const fullPath = convertPath.fullPath(f.path);
        imports[f.path] = parseImports(fullPath, opts);
      });
      resolve(imports);
    });
  });

  return Promise.all([cache.navItems, cache.imports]);
};

exports.setModules = (modules) => {
  cache.modules = new Promise((resolve) => {
    resolve(parseModules(modules, TXL_ROOT));
  });
};

exports.get = () => cache;
