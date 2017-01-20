const path = require('path');
const fs = require('fs');
const navItems = require('./navItems');
const parseImports = require('./parseImports');

const cache = {};

exports.set = (hash) => {
  if (cache.hash == null || cache.hash !== hash) {
    const opts = { cwd: path.resolve(process.cwd(), '..', 'TXL_components') };
    cache.navItems = new Promise(resolveNav => {
      cache.imports = new Promise(resolveImports => {
        const items = navItems('src/**/*.demo.jsx', opts);
        resolveNav(items);

        const imports = {};
        items.files.forEach(f => imports[f] = parseImports(f, opts));
        resolveImports(imports);
      });
    });
  }
}

exports.get = () => cache;
