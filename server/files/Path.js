const fs = require('fs');

class Path {
  constructor(name, cwd, resolver) {
    this.name = name;
    this.cwd = cwd;
    this.type = (name) => resolver.type(name);
    this.path = name;
    this.resolve = (path) => resolver.resolve(path);
    this.isAbsolute = (name) => resolver.isAbsolute(name);
  }

  valid() {
    return this.path != null && fs.existsSync(this.path);
  }
}

module.exports = Path;
