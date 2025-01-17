const path = require('path');
const fs = require('fs');

const convertPath = require('./convertPath');

const removeExt = filePath => filePath.replace(/\.jsx|\.js/, '');

const getPkg = (filePath) => {
  let root = path.dirname(filePath);
  /* eslint import/no-dynamic-require: 0, global-require: off */
  while (root.length > 1 && root.indexOf('node_modules') >= 0) {
    const pkgPath = path.resolve(root, 'package.json');
    if (fs.existsSync(pkgPath)) {
      return require(pkgPath);
    }
    root = path.dirname(root);
  }

  return {};
};

const trimPath = (filePath, token) => {
  if (token == null) {
    return filePath;
  }

  const parts = filePath.split(path.sep);

  return path.join(...parts.slice(parts.indexOf(path.normalize(token)) + 1));
};

const getName = (filePath) => {
  const pkg = getPkg(filePath);
  const { main } = pkg;
  const name = pkg.name || (pkg._requested && pkg._requested.name);
  let rest = trimPath(filePath, 'node_modules');
  rest = trimPath(rest, name);
  rest = trimPath(rest, main);

  return pkg.name != null ? name : path.join(name, rest);
};

const getModuleName = (filePath, cwd) => {
  const resolveName = fp => fs.existsSync(fp) && getName(fp);

  const txlName = resolveName(path.resolve(cwd, filePath));

  if (txlName) {
    return txlName;
  }

  const localName = resolveName(path.resolve(__dirname, '..', '..', filePath));

  if (localName) {
    return localName;
  }

  return filePath;
};

const parseResource = (module, cwd) => {
  // if module.context is empty || userRequest contains node_modules
  // the module may live inside of the vendor dll
  if (module.context == null || /node_modules/.test(module.userRequest)) {
    return getModuleName(module.userRequest, cwd);
  }

  return convertPath.truncatePath(module.userRequest);
};

const resolveModuleInfo = (module, cwd) => {
  // the module is a system module skip it
  if (module.request == null) {
    return null;
  }

  // the module is a library
  if (module.userRequest == null) {
    return {
      name: module.request,
      path: module.request,
    };
  }

  return {
    name: parseResource(module, cwd),
    path: convertPath.truncatePath(module.userRequest, cwd),
    vendor: typeof module.id === 'number',
  };
};

module.exports = (modules, cwd) => modules
  .map(module => ({ info: resolveModuleInfo(module, cwd), module }))
  .filter(({ info }) => info != null)
  .map(({ module, info }) =>
    Object.assign({}, info, {
      id: module.id,
      name: removeExt(info.name),
    }));
