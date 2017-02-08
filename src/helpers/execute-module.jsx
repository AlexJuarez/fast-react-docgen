import React from 'react';

import resolveModules from './import-resolver';

const BABEL_OPTS = {
  parserOpts: {
    allowReturnOutsideFunction: true,
  },
  plugins: ['rm-import'],
  presets: [
    'react',
    'es2015',
    'stage-1',
  ],
};

const template = (code, decs) => (
  `((${decs.join(', ')}) => {
  try {
    ${code}
  } catch (err) {
    return err.message;
  }
})`);

/* eslint no-eval: off */

const rmImports = () => ({
  visitor: {
    ImportDeclaration(path) {
      return path.remove();
    },
  },
});

const executeCode = (code, file, modules) =>
  new Promise((resolve) => {
    require.ensure([], () => {
      const { transform, registerPlugin, availablePlugins } = require('babel-standalone');

      if (availablePlugins['rm-import'] == null) {
        registerPlugin('rm-import', rmImports);
      }

      try {
        const { decs, sources } = resolveModules(code, file, modules);
        const transformedCode = template(transform(code, BABEL_OPTS).code, decs);
        const fn = eval(transformedCode);
        resolve(fn(...sources));
      } catch (err) {
        resolve(<pre>{err.message}</pre>);
      }
    }, 'babel-standalone');
  });

export default executeCode;
