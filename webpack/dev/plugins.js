const webpack = require('webpack');

const getTxlRoot = require('../../server/getTxlRoot');

const plugins = [
  new webpack.DllReferencePlugin({
    context: '.',
    manifest: require('../../public/dll/vendor-manifest.json'),
  }),
  new webpack.DllReferencePlugin({
    context: getTxlRoot.relative(),
    manifest: require('../../public/dll/vendor-manifest.json'),
  }),
  new webpack.HotModuleReplacementPlugin(),
];

module.exports = plugins;
