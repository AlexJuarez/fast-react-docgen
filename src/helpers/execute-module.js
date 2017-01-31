import { transform, registerPlugin } from 'babel-standalone'
import resolveModules from './import-resolver';

registerPlugin('rm-import', () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        return path.remove();
      },
    },
  };
});

const BABEL_OPTS = {
  parserOpts: {
    allowReturnOutsideFunction: true,
  },
  presets: [
    'react',
    'es2015',
    'stage-1',
  ],
  plugins: ['rm-import'],
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
const executeCode = (code, file, modules) => {
  try {
    const { decs, sources } = resolveModules(code, file, modules);
    const transformedCode = template(transform(code, BABEL_OPTS).code, decs);
    const fn = eval(transformedCode);
    return () => fn.apply(null, sources);
  } catch (err) {
    return <pre>{err.message}</pre>;
  }
};

export default executeCode;
