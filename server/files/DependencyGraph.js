const path = require('path');

const FileMap = require('./FileMap');
const Resolver = require('../docgen/resolve-imports');

class DependencyGraph {
  constructor(root) {
    this.files = new FileMap();
    const { resolve, type, isAbsolute } = Resolver(root);
    this.resolve = resolve;
    this.isAbsolute = isAbsolute;
    this.type = type;
  }

  getPath(name, cwd = "") {
    const type = this.type(name);
    switch (type) {
      case 'builtin':
        break;
      case 'external':
        return name;
      default: {
        return this.isAbsolute(name) ? name : path.join(cwd, name);
      }
    }
  }

  register(name, cwd) {
    const rawPath = this.getPath(name, cwd);

    if (rawPath == null) {
      return;
    }

    const fp = this.resolve(rawPath);
    if (fp == null) {
      return;
    }

    if (!this.files.has(fp)) {
      this.files.add(fp, this.type(name));
    }

    const file = this.files.get(fp);
    if (!file.isStale()) {
      return;
    }

    file.refresh();
    file.getDependencies().forEach(p => {
      this.register(p, file.dirname);
    });
  }
}

module.exports = DependencyGraph;
