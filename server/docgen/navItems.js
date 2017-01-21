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

function writeGeneratedFile(files, cwd) {
  const output = files
    .map(f => `require('${path.resolve(cwd, f)}');`)
    .join('\n');

  const outputPath = path.resolve(process.cwd(), 'src', 'requires.js');

  if (!fs.existsSync(outputPath)) {
    fs.writeFileSync(outputPath, output);
  }
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
      title: getTitle(filePath),
      file: fullPath,
    });
  });

  writeGeneratedFile(files, opts.cwd);

  return {
    files: Object.keys(demos),
    cwd: opts.cwd,
    categories
  };
}

module.exports = navItems;
