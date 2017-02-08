const EventEmitter = require('events');
const http = require('http');

const compression = require('compression');
const express = require('express');

const logger = require('./util/logger');
const routes = require('./routes');
const webpack = require('./webpack');

const log = logger.create('server');

class Server extends EventEmitter {
  constructor(config = {}) {
    super();

    this._port = config.port || process.env.PORT;
    this._app = express();
    this._config = config;

    this.use(compression());
  }

  use(...args) {
    this._app.use(...args);
  }

  get(...args) {
    this._app.get(...args);
  }

  start() {
    webpack(this._app).then(() => {
      routes(this._app);

      this._server = http.createServer(this._app).listen(this._port);

      const { port } = this._server.address();

      log.info(`listening at localhost:${port} & 0.0.0.0:${port}`);
      this.emit('ready');
    });
  }
}

module.exports = Server;
