const logger = require('./server/util/logger');
const constants = require('./server/util/constants');
const express = require('express');
const path = require('path');

logger.setup(constants.LOG_DEBUG, true);
const log = logger.create('server');

const Server = require('./server/');

const server = new Server({ port: 8080 });

server.use('/public', express.static(path.resolve(__dirname, 'public')));

server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

server.on('ready', () => {
  log.debug('is ready');
});

server.start();
