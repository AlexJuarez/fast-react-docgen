const glob = require('glob');
const path = require('path');
const parseImports = require('./parseImports');
const fs = require('fs');

function getCategory(filePath) {
  return filePath.split(path.sep).splice(-2).reverse().pop();
}

function getTitle(filePath) {
  return path.basename(filePath).replace('.demo.jsx', '');
}

function navItems(src, opts) {
  const files = glob.sync(src, opts);

  const categories = {};
  const demos = {};

  files.forEach((filePath) => {
    const category = getCategory(filePath);
    const fullPath = path.resolve(opts.cwd, filePath);

    if (categories[category] == null) {
      categories[category] = [];
    }

    demos[fullPath] = true;

    categories[category].push({
      file: fullPath,
      title: getTitle(filePath),
    });
  });

  return {
    files: Object.keys(demos)
      .map(file => ({
        path: file,
        category: getCategory(file),
        title: getTitle(file)
      })),
    cwd: opts.cwd,
    categories
  };
}

module.exports = navItems;
