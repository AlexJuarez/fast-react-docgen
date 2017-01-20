const logger = require('./server/util/logger');
const constants = require('./server/util/constants');
const express = require('express');
const path = require('path');
const cache = require('./server/docgen/cache');

logger.setup(constants.LOG_DEBUG, true);
const log = logger.create('server');

const Server = require('./server/');

const server = new Server({ port: 8080 });

server.get('/api/nav', (req, res) => {
  cache.get().navItems.then((items) => {
    res.json(items);
  });
});

server.get('/api/imports', (req, res) => {
  cache.get().imports.then((imports) => {
    res.json(imports);
  });
});

server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

server.on('ready', () => {
  log.debug('is ready');
});

server.start();
