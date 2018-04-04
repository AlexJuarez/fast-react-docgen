const throttle = require('lodash/throttle');
const fs = require('fs');

const resolvePath = require('./resolvePath');
const getDependencies = require('./getDependencies');

class FileNode {
  constructor({ name, path, type }) {
    this.name = name;
    this.path = path;
    this.type = type;
    this.isStale = throttle(this.isStale.bind(this), 100);
    this.refresh();
  }

  isStale() {
    const mtime = this.lastModified();

    return this.mtime == null || mtime > this.mtime;
  }

  refresh() {
    this.mtime = this.lastModified();
    this.source = null;
    this.dependencies = null;
  }

  lastModified() {
    return fs.statSync(this.path).mtime;
  }

  getSource() {
    if (this.source == null) {
      this.source = fs.readFileSync(this.path, { encoding: 'utf8' });
    }

    return this.source;
  }

  getDependencies() {
    if (this.dependencies == null) {
      this.dependencies = getDependencies(this.getSource());
    }

    return this.dependencies;
  }
}

module.exports = FileNode;
