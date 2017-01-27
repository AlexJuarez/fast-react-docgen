const glob = require('glob');
const path = require('path');
const parseImports = require('./parseImports');
const fs = require('fs');

const getCategory = (filePath) => filePath.split(path.sep).splice(-2).reverse().pop();

const getTitle = (filePath, demoExt) => path.basename(filePath).replace(demoExt, '');

function navItems(src, { cwd, demoExt}) {
  const files = glob.sync(src, { cwd });

  const categories = {};
  const demos = {};

  files.forEach((filePath) => {
    const category = getCategory(filePath);
    const fullPath = path.resolve(cwd, filePath);

    if (categories[category] == null) {
      categories[category] = [];
    }

    demos[fullPath] = true;

    categories[category].push({
      file: fullPath,
      title: getTitle(filePath, demoExt),
    });
  });

  return {
    files: Object.keys(demos)
      .map(file => ({
        path: file,
        code: fs.readFileSync(file).toString(),
        category: getCategory(file),
        title: getTitle(file, demoExt)
      })),
    cwd: cwd,
    categories
  };
}

module.exports = navItems;
