const cache = require('./docgen/cache');
const getFile = require('./docgen/getFile');

module.exports = (app) => {
  app.get('/api/nav', (req, res) => {
    cache.get().navItems.then((items) => {
      res.json(items);
    });
  });

  app.get('/api/imports', (req, res) => {
    cache.get().imports.then((imports) => {
      res.json(imports);
    });
  });

  app.get('/api/file', (req, res) => {
    const filename = req.query.filename;

    getFile(filename).then((source) => {
      res.send(source);
    });
  });
}