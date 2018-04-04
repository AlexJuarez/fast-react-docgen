const FileNode = require('./FileNode');

class FileMap {
  constructor() {
    this.files = {};
  }

  get(path) {
    return this.files[path];
  }

  has(path) {
    return this.files[path] != null;
  }

  add(path, type) {
    if (!this.has(path)) {
      this.files[path] = new FileNode({ path, type });
    }
  }
}

module.exports = FileMap;
