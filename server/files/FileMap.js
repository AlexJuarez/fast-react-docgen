const Resolver = require('../docgen/resolve-imports');
const FileNode = require('./FileNode');

class FileMap {
  constructor(cwd, path) {
    this.files = {};
    this.resolver = Resolver(cwd);
    this.add(path);
  }

  get(name) {
    const path = this.resolver.resolve(name);

    if (this.files[path] == null) {
      this.files[path] = new FileNode({ name, path, type: this.resolver.type(name) });
    }

    return this.files[path];
  }

  add(name) {
    const file = this.get(name);

    if (file.isStale()) {
      file.refresh();

      file.getDependencies().forEach(path => {
        this.add(path);
      });
    }
  }
}

module.exports = FileMap;
