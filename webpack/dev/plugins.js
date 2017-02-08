const path = require('path');

const webpack = require('webpack');

const TXL_ROOT = require('../../server/getTxlRoot')();

const plugins = [
  new webpack.DllReferencePlugin({
    context: '.',
    manifest: require('../../public/dll/vendor-manifest.json'),
  }),
  new webpack.DllReferencePlugin({
    context: path.relative(path.resolve(__dirname, '..', '..'), TXL_ROOT),
    manifest: require('../../public/dll/vendor-manifest.json'),
  }),
  new webpack.HotModuleReplacementPlugin(),
];

module.exports = plugins;
