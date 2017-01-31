const path = require('path');

const config = require('./webpack.config');

const cwd = path.resolve(__dirname, '..', 'TXL_components');

module.exports = config({ cwd });
