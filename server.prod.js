const path = require('path');
const http = require('http');

const compression = require('compression');
const express = require('express');
const logger = require('./server/util/logger');
const log = logger.create('server');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(compression());

const publicPath = path.resolve(__dirname, 'public');

app.use('/', express.static(path.join(publicPath)));
app.use('/components*', express.static(path.join(publicPath)));
app.use('/public', express.static(publicPath));
app.get('/api/imports', (req, res) => {
  res.sendFile(path.join(publicPath, 'imports.json'));
});
app.get('/api/nav', (req, res) => {
  res.sendFile(path.join(publicPath, 'navItems.json'));
});
app.get('/api/modules', (req, res) => {
  res.sendFile(path.join(publicPath, 'modules.json'));
});

const server = http.createServer(app).listen(PORT);
const { port } = server.address();

log.info(`listening at (localhost)[0.0.0.0]:${port}`);