module.exports = jscodeshift => {
  const { types } = jscodeshift;
  const { def } = types.Type;
  if (!def('ExperimentalRestProperty').finalized) {
    def('ExperimentalRestProperty')
      .bases('Node')
      .build('argument')
      .field('argument', def('Expression'));
    def('ExperimentalSpreadProperty')
      .bases('Node')
      .build('argument')
      .field('argument', def('Expression'));
    types.finalize();
  }
};
