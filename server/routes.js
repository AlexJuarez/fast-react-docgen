const cache = require('./docgen/cache');

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
};
