const path = require('path');

const navItems = require('./navItems');
const parseImports = require('./parseImports');

const cache = {};

exports.set = (hash, { cwd, demoExt }) => {
  const TXL_SRC = path.join(cwd, 'src');

  if (cache.hash == null || cache.hash !== hash) {
    const opts = { cwd, demoExt };
    cache.navItems = new Promise((resolveNav) => {
      cache.imports = new Promise((resolveImports) => {
        const items = navItems(`src/**/*${demoExt}`, opts);
        resolveNav(items);

        const imports = {};
        items.files.forEach((f) => {
          const fullPath = f.path.replace(/^txl/, TXL_SRC);
          imports[fullPath] = parseImports(fullPath, opts);
        });
        resolveImports(imports);
      });
    });
  }
};

exports.get = () => cache;
