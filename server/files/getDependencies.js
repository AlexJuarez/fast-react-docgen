const jscodeshift = require('jscodeshift');

const getDependencies = (source) => {
  const dependencies = [];

  const parser = require('./parser/babylon');
  const j = jscodeshift.withParser(parser);

  j(source)
    .find(j.ImportDeclaration)
    .forEach((p) => {
      const name = p.value.source.value;
      dependencies.push(name);
    });

  return dependencies;
};

module.exports = getDependencies;
