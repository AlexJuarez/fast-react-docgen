const jscodeshift = require('jscodeshift');
const parser = require('babel-eslint');
const addTypes = require('./add-types');
addTypes(jscodeshift);
const j = jscodeshift.withParser(parser);

module.exports = (content) => {
  const root = j(content);

  root
    .find(j.ReturnStatement)
    .filter(p => p.parent.node.type === j.Program.name)
    .replaceWith(p => j.expressionStatement(
      j.assignmentExpression(
        '=',
        j.memberExpression(j.identifier('module'), j.identifier('exports')),
        j.arrowFunctionExpression([], p.node.argument)
      )
    ));

  return root.toSource();
};