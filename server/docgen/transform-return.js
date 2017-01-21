module.exports = function({ types: t }) {
  return {
    visitor: {
      ReturnStatement(path) {
        if (t.isProgram(path.parent)) {
          path.replaceWith(
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.identifier('module'),
                  t.identifier('exports')
                ),
                path.node.argument,
              )
            )
          );
        }
      }
    }
  }
}