const path = require('path');
const express = require('express');

const log = require('./util/logger').create('server-routes');

module.exports = (app) => {
  const publicDir = path.resolve(__dirname, '..', 'public');
  app.use('/public', express.static(publicDir));
};
