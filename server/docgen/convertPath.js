const path = require('path');

const getTxlRoot = require('../getTxlRoot');

const TxlSrc = () => path.join(getTxlRoot(), 'src');

const txlPath = filePath => filePath.replace(TxlSrc(), 'txl');

const fullPath = filePath => filePath.replace('txl', TxlSrc());

module.exports = {
  fullPath,
  txlPath,
};
