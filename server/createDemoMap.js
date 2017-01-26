const path = require('path');
const fs = require('fs-extra');

module.exports = (demos) => {
  let output = demos.map(p => {
    return `  '${p}': require('${p}')`
  }).join(',\n');

  fs.outputFileSync(
    path.resolve(__dirname, '..', 'src', 'demoMap.js'),
    `module.exports = {\n${output}\n};\n`
  );
};
