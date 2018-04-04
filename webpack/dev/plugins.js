const webpack = require('webpack');

const getRelPkgPath = require('../../server/getRelPkgPath');

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
];

module.exports = plugins;
