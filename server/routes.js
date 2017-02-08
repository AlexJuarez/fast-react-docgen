const path = require('path');
const express = require('express');

const cache = require('./docgen/cache');
const log = require('./util/logger').create('server-routes');

const DEV_MODE = (process.env.NODE_ENV !== 'production');

module.exports = (app) => {
  app.get('/api/nav', (req, res) => {
    cache.get().navItems.then((items) => {
      res.json(items);
    }).catch((err) => {
      log.error(err);
    });
  });

  app.get('/api/imports', (req, res) => {
    cache.get().imports.then((imports) => {
      res.json(imports);
    }).catch((err) => {
      log.error(err);
    });
  });

  app.get('/api/modules', (req, res) => {
    cache.get().modules.then((modules) => {
      res.json(modules);
    }).catch((err) => {
      log.error(err);
    });
  });

  const publicDir = path.resolve(__dirname, '..', 'public');
  app.use('/public', express.static(publicDir));

  if (!DEV_MODE) {
    const indexHtml = path.resolve(__dirname, '..', 'public/index.html');
    app.get('/', (req, res) => {
      res.sendFile(indexHtml);
    });

    app.get('/components/*', (req, res) => {
      res.sendFile(indexHtml);
    });
  }
};
