const path = require('path');

const fs = require('fs-extra');
const glob = require('glob');

const convertPath = require('../docgen/convertPath');
const log = require('./logger').create('demo-maps');

const shouldUpdateDemoMap = (filePath, newMap) => {
  try {
    const oldDemoMap = fs.readFileSync(filePath).toString();
    return oldDemoMap !== newMap;
  } catch (err) {
    return true;
  }
};

module.exports = ({ cwd, demoExt }) => new Promise((resolve) => {
  const demos = glob.sync(`${cwd}/src/**/*${demoExt}`, { absolute: true });

  let output = demos
    .map(p => `  '${convertPath.txlPath(p)}': require('${convertPath.txlPath(p)}')`)
    .join(',\n');

  output = `module.exports = {\n${output}\n};\n`;

  const demoMapPath = path.resolve(__dirname, '..', '..', 'src', 'demoMap.js');

  if (shouldUpdateDemoMap(demoMapPath, output)) {
    log.debug(`updating demoMap ${path.relative(process.cwd(), demoMapPath)}`);
    fs.outputFileSync(
      demoMapPath,
      output
    );
  }

  resolve();
});
