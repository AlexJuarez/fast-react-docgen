const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..', '..');

// format path ../TXL_components/src/[name] -> txl/[name]
const convertToTXL = filePath => filePath.replace(/^.+TXL_components\/src/, 'txl');

const removeExt = filePath => filePath.replace(/\.jsx|\.js/, '');

const getPkg = (filePath) => {
  const parts = filePath.split(path.sep);
  const index = parts.indexOf('node_modules');

  const pkgPath = path.resolve(parts.slice(0, index + 2).join(path.sep), 'package.json');
  /* eslint import/no-dynamic-require: 0, global-require: off */
  if (fs.existsSync(pkgPath)) {
    return require(pkgPath);
  }

  return {};
};

const trimPath = (filePath, token) => {
  if (token == null) {
    return filePath;
  }

  const parts = filePath.split(path.sep);

  return path.join(...parts.slice(parts.indexOf(path.normalize(token)) + 1));
}

const getName = (filePath) => {
  const pkg = getPkg(filePath);
  const { main } = pkg;
  const { name } = pkg._requested;
  let rest = trimPath(filePath, 'node_modules');
  rest = trimPath(rest, name);
  rest = trimPath(rest, main);

  return path.join(name, rest);
}

const getModuleName = (filePath) => {
  const resolveName = (fp) => fs.existsSync(fp) && getName(fp);

  const localName = resolveName(path.resolve(rootDir, filePath));

  if (localName) {
    return localName;
  }

  const txlName = resolveName(path.resolve(rootDir, '..', 'TXL_components', filePath));

  if (txlName) {
    return txlName;
  }

  return filePath;
};

const parseResource = (module) => {
  // if module.context is empty || userRequest contains node_modules
  // the module may live inside of the vendor dll
  if (module.context == null || /node_modules/.test(module.userRequest)) {
    return getModuleName(module.userRequest);
  }

  return convertToTXL(module.userRequest);
};

const resolveModuleInfo = (module) => {
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
    name: parseResource(module),
    path: convertToTXL(module.userRequest),
    vendor: typeof module.id === 'number',
  };
};

module.exports = (modules) => {
  return modules
    .map((module) => ({ module, info: resolveModuleInfo(module) }))
    .filter(({ info }) => info != null)
    .map(({ module, info }) =>
      Object.assign({}, info, {
        id: module.id,
        name: removeExt(info.name),
      }));
};
