const path = require('path');

const getPkgRoot = require('../getPkgRoot');

const truncatePath = filePath => filePath.replace(getPkgRoot(), ':remote');

const expandPath = filePath => filePath.replace(':remote', getPkgRoot());

module.exports = {
  truncatePath,
  expandPath,
};
