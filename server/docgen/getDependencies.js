const fs = require('fs');
const path = require('path');

const jscodeshift = require('jscodeshift');
const Resolver = require('./resolve-imports');

const extCache = {};
const ext = (filePath) => {
  if (extCache[filePath]) {
    return extCache[filePath];
  }

  const result = fs.existsSync(`${filePath}.jsx`) ? `${filePath}.jsx` : `${filePath}.js`;
  extCache[filePath] = result;

  return result;
};

const getDependencies = (filePath, cwd) => {
  const components = [];
  const resolver = Resolver(cwd);
  const parser = require('./parser/babylon');
  const j = jscodeshift.withParser(parser);

  const source = fs.readFileSync(filePath, { encoding: 'utf8' });

  let { mtime } = fs.statSync(filePath);
  j(source)
    .find(j.ImportDeclaration)
    .forEach((p) => {
      const name = p.value.source.value;
      const resolvedName = resolver.resolve(name) || name;
      const type = resolver.type(name, resolvedName);
      const fullPath = resolver.isAbsolute(resolvedName) ?
        resolvedName :
        ext(path.resolve(path.dirname(filePath), resolvedName));

      if (type !== 'external') {
        const mtime2 = fs.statSync(require.resolve(fullPath)).mtime;

        if (mtime < mtime2) {
          mtime = mtime2;
        }
      }

      if (type === 'sibling') {
        components.push(fullPath);
      }
    });

  return { components, mtime };
}

module.exports = getDependencies;
