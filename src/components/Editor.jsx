import React, { Component } from 'react';
import CodeMirror from 'codemirror';
import { transform, registerPlugin } from 'babel-standalone'
import resolveModules from '../helpers/import-resolver';

require('codemirror/mode/jsx/jsx');
require('codemirror/lib/codemirror.css');

registerPlugin('rm-import', babel => {
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

type Props = {
  code: string,
  file: string,
  modules: ?any,
};

type State = {
  code: string,
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
    return fn.apply(null, sources);
  } catch (err) {
    return <div>{err.message}</div>;
  }
};

class Editor extends Component {
  constructor(props: Props, context: Object) {
    super(props, context);

    this.state = {
      code: props.code,
    };

    this._onChange = this._onChange.bind(this);

    this.codeMirrorConfig = {
      lineNumbers: true,
      mode: 'jsx',
    };
  }

  state: State;

  componentWillReceiveProps(nextProps) {
    if (nextProps.code !== this.props.code) {
      this.editor.setValue(nextProps.code);
      this.setState({ code: nextProps.code });
    }
  }

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this._textarea, this.codeMirrorConfig);
    this.editor.on('change', this._onChange);
  }

  props: Props;

  _onChange() {
    this.setState({ code: this.editor.getValue() });
  }

  _renderDemo() {
    return executeCode(this.state.code, this.props.file, this.props.modules);
  }

  render() {
    return (
      <div>
        {this._renderDemo()}
        <textarea
          value={this.state.code}
          onChange={this._onChange}
          ref={(n) => { this._textarea = n; }}
        />
      </div>
    );
  }
}

export default Editor;
