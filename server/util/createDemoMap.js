const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const log = require('./logger').create('demo-maps');

const shouldUpdateDemoMap = (filePath, newMap) => {
  try {
    const oldDemoMap = fs.readFileSync(filePath).toString();
    return oldDemoMap !== newMap;
  } catch (err) {
    return true;
  }
};

module.exports = ({ cwd, demoExt }) => {
  const demos = glob.sync(cwd + '/src/**/*' + demoExt, { absolute: true });

  let output = demos.map(p => {
    return `  '${p}': require('${p}')`
  }).join(',\n');

  output = `module.exports = {\n${output}\n};\n`;

  const demoMapPath = path.resolve(__dirname, '..', '..', 'src', 'demoMap.js');

  if (shouldUpdateDemoMap(demoMapPath, output)) {
    log.debug(`updating demoMap ${path.relative(process.cwd(), demoMapPath)}`);
    fs.outputFileSync(
      demoMapPath,
      output
    );
  }
};
