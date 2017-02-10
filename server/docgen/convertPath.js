const path = require('path');

const TXL_ROOT = path.resolve(__dirname, '..', '..', require('../getTxlRoot')());

console.log(TXL_ROOT);

const txlPath = filePath => filePath.replace(path.join(TXL_ROOT, 'src'), 'txl');

const fullPath = filePath => filePath.replace('txl', path.join(TXL_ROOT, 'src'));

module.exports = {
  fullPath,
  txlPath,
};
