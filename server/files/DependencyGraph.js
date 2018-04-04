const FileMap = require('./FileMap');
const PathResolver = require('./PathResolver');

class DependencyGraph {
  constructor(root) {
    this.files = new FileMap();
    this.pathResolver = new PathResolver(root);
  }

  register(name, cwd) {
    const pathNode = this.pathResolver.resolve(name, cwd);

    if (!pathNode.isValid()) {
      return;
    }

    const { path } = pathNode;
  
    if (!this.files.has(path)) {
      this.files.add(pathNode);
    }

    const file = this.files.get(path);
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
