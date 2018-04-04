const fs = require('fs');

class Path {
  constructor(name, cwd, type) {
    this.name = name;
    this.cwd = cwd;
    this.type = type;
    this.path = name;
  }

  isValid() {
    return this.path != null && fs.existsSync(this.path);
  }
}

module.exports = Path;
