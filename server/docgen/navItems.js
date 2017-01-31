const fs = require('fs');
const path = require('path');

const glob = require('glob');

const getCategory = filePath => filePath.split(path.sep).splice(-2).reverse().pop();

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
    categories,
    cwd,
    files: Object.keys(demos)
      .map(file => ({
        category: getCategory(file),
        code: fs.readFileSync(file).toString(),
        path: file,
        title: getTitle(file, demoExt),
      })),
  };
}

module.exports = navItems;
