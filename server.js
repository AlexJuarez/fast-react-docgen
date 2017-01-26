const logger = require('./server/util/logger');
const constants = require('./server/util/constants');
const express = require('express');
const path = require('path');
const glob = require('glob');
const createDemoMap = require('./server/createDemoMap');

const TXL_ROOT = path.resolve('../TXL_components');

logger.setup(constants.LOG_DEBUG, true);
const log = logger.create('server');

const Server = require('./server/');

const demos = glob.sync(TXL_ROOT + '/src/**/*.demo.jsx', { absolute: true });
createDemoMap(demos);

const server = new Server({ port: 8080 });

server.use('/public', express.static(path.resolve(__dirname, 'public')));

server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

server.on('ready', () => {
  log.debug('is ready');
});

server.start();
