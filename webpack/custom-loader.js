const jscodeshift = require('jscodeshift');
const parser = require('babel-eslint');
const addTypes = require('./add-types');

module.exports = (content) => {
  addTypes(jscodeshift);
  const j = jscodeshift.withParser(parser);
  const root = j(content);

  root
    .find(j.ReturnStatement)
    .filter(p => p.parent.node.type === j.Program.name)
    .replaceWith(p => j.exportDefaultDeclaration(p.node.argument));

  return root.toSource();
};