const FileMap = require('./FileMap');
const PathResolver = require('./PathResolver');

class DependencyGraph {
  constructor(root) {
    this.files = new FileMap();
    const resolver = new PathResolver(root);
    this.resolve = (name, cwd) => resolver.createPathNode(name, cwd);
  }

  register(name, cwd) {
    const pathNode = this.resolve(name, cwd);

    console.log(pathNode);

    if (!pathNode.valid()) {
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
