const express = require('express');
const EventEmitter = require('events');
const webpack = require('./webpack');
const routes = require('./routes');
const http = require('http');
const compression = require('compression');
const logger = require('./util/logger');
const log = logger.create('server');


class Server extends EventEmitter {
  constructor(config = {}) {
    super();

    this._port = config.port || process.env.PORT;
    this._app = express();

    this.use(compression());
    webpack(this._app, require('../webpack.config'));
    routes(this._app);
  }

  use(...args) {
    this._app.use(...args);
  }

  get(...args) {
    this._app.get(...args);
  }

  start() {
    this._server = http.createServer(this._app).listen(this._port);

    const { address, port } = this._server.address();

    log.debug(`listening at ${address}:${port}`);
    this.emit('ready');
  }
}

module.exports = Server;
