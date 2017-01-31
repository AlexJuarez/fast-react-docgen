const isRelative = filePath => filePath.charAt(0) === '.';

const normalizePath = (context, filePath) => {
  const out = context.split('/').filter(c => c).slice(0, -1);
  filePath.split('/').forEach((token) => {
    switch (token) {
      case '.':
      case '':
        break;
      case '..':
        out.pop();
        break;
      default:
        out.push(token);
        break;
    }
  });

  return out.join('/');
};

const convertToTXL = filePath => filePath.replace(/.+TXL_components\/src/, 'txl');

const resolveImportName = (filePath, context) => {
  if (!isRelative(filePath)) {
    return filePath;
  }

  return convertToTXL(normalizePath(context, filePath));
};

const grammer = (stack, imports, file) => {
  const top = () => stack[stack.length - 1];
  const topTypeIs = type => stack.length >= 1 && top().type === type;

  const pushImport = (source, dec) => {
    imports.push({
      dec,
      source: resolveImportName(source.replace(/['|"]+/g, ''), file),
    });
  };

  const createImport = () => {
    if (stack.length >= 2 && topTypeIs('from')) {
      const from = stack.pop();
      const i = stack.pop();
      if (i.specifiers.length) {
        i.specifiers.push(i.data.splice(0, i.data.length).join(''));
        i.specifiers.forEach((dec) => {
          pushImport(from.data.join(''), dec);
        });
      } else {
        pushImport(from.data.join(''), i.data.join(''));
      }
    }
  };

  return {
    after: (token) => {
      if (topTypeIs('import')) {
        top().lastToken = token;
      }
    },
    cleanUp: () => {
      createImport();
    },
    default: (token) => {
      if (stack.length) {
        top().data.push(token);
      }
    },
    exec: {
      '*': () => {},
      ',': () => {
        if (topTypeIs('import')) {
          const t = top();
          if (!t.depth) {
            t.specifiers.push(t.data.splice(0, t.data.length).join(''));
          } else {
            t.data.push(', ');
          }
        }
      },
      ';': createImport,
      as: () => {
        if (topTypeIs('import') && top().lastToken !== '*') {
          top().data.push(': ');
        }
      },
      from: () => {
        stack.push({ data: [], lastToken: null, type: 'from' });
      },
      import: () => {
        createImport();
        stack.push({ data: [], depth: 0, lastToken: null, specifiers: [], type: 'import' });
      },
      '{': () => {
        if (topTypeIs('import')) {
          top().data.push('{ ');
          top().depth++;
        }
      },
      '}': () => {
        if (topTypeIs('import')) {
          const t = top();
          if (t.data[t.data.length - 1] === ', ') {
            t.data.pop();
          }
          t.data.push(' }');
          t.depth--;
        }
      },
    },
  };
};

const getImports = (code, file) => {
  const tokens = code
    .replace(/;/g, ' ; ')
    .replace(/,/g, ' , ')
    .replace(/{/g, ' { ')
    .replace(/}/g, ' } ')
    .split(/\s+/);
  const stack = [];
  const imports = [];
  const rules = grammer(stack, imports, file);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (rules.exec[token] != null) {
      rules.exec[token](token);
    } else {
      rules.default(token);
    }

    rules.after(token);
  }

  rules.cleanUp();

  return imports;
};

const cache = {};
const getModuleByName = (modules, name) => {
  if (cache[name] != null) {
    return cache[name];
  }

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    if (module.name === name) {
      cache[name] = module;
      return module;
    }
  }

  throw new Error(`Could not locate module: ${name}`);
};

/* global __webpack_modules__: false, __webpack_require__: false */
const resolveModule = (modules, name) => {
  const { id } = getModuleByName(modules, name);
  const vendorId = getModuleByName(modules, 'vendor').id;

  if (__webpack_modules__[id]) {
    return __webpack_require__(id);
  }

  return __webpack_require__(vendorId)(id);
};

const resolveModules = (file, code, modules) => {
  const imports = getImports(file, code);
  const decs = [];
  const sources = [];

  imports.forEach((i) => {
    const module = resolveModule(modules, i.source);
    decs.push(i.dec);
    if (!/({.+})/.test(i.dec) && module.default != null) {
      sources.push(module.default);
    } else {
      sources.push(module);
    }
  });

  return { decs, sources };
};

export default resolveModules;
