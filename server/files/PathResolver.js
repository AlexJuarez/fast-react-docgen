
const Resolver = require('../docgen/resolve-imports');
const Path = require('./Path');

const pathTypes = (pathNode) => {
  const { name, cwd, type } = pathNode;
  switch (type) {
    case 'builtin':
      break;
    case 'external':
      pathNode.path = name;
      break;
    default: {
      pathNode.path = this.isAbsolute(name) ? name : path.join(cwd, name);
      break;
    }
  }
}

const expandPaths = (pathNode) => {
  const { path } = pathNode;

  if (!path.startsWith(':')) {
    return;
  }

  path.replace(':monorail', './app/assests/javascripts');
  path.replace(':', './frontend/');
}

const resolvePath = (pathNode) => {
  pathNode.path = this.resolve(pathNode.path);
}

class PathResolver {
  constructor(root) {
    const { resolve, type, isAbsolute } = Resolver(root);
    this.resolve = resolve;
    this.isAbsolute = isAbsolute;
    this.type = type;
  
    this.fns = [];
    this.add(expandPaths);
    this.add(pathTypes);
    this.add(resolvePath);
  }

  add(middleware) {
    this.fns.push(middleware.bind(this));
  }

  resolve(name, cwd = '') {
    const type = this.type(name);
    const pathNode = new Path(name, cwd, type);

    for (let i = 0; i < this.fns.length; i++) {
      const fn = fns[i];

      fn.call(this, pathNode);
    }

    return pathNode;
  }
}

module.exports = PathResolver;
