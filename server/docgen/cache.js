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
        let start = new Date();
        const items = navItems('src/**/*.demo.jsx', opts);
        console.log(`items take ${new Date() - start}`);
        resolveNav(items);
        const imports = {};
        start = new Date();
        items.files.forEach(f => imports[f] = parseImports(f, opts));
        console.log(`imports take ${new Date() - start}`);
        resolveImports(imports);
      });
    });
  }
}

exports.get = () => cache;
