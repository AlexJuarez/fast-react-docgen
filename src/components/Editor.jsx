import React, { Component } from 'react';
import CodeMirror from 'codemirror';
import { transform } from 'babel-standalone';

require('codemirror/mode/jsx/jsx');
require('codemirror/lib/codemirror.css');

const BABEL_OPTS = {
  parserOpts: {
    allowReturnOutsideFunction: true,
  },
  presets: [
    'react',
    'es2015',
    'stage-1',
  ],
};

type Props = {
  code: string,
};

type State = {
  code: string,
};

const template = code => (
`(() => {
  try {
    ${code}
  } catch (err) {
    return err.message;
  }
})`);

/* eslint no-eval: off */
const executeCode = (code) => {
  const transformedCode = template(transform(code, BABEL_OPTS).code);
  return eval(transformedCode);
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

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this._textarea, this.codeMirrorConfig);
    this.editor.on('change', this._onChange);
  }

  props: Props;

  _onChange() {
    executeCode(this.state.code);
    this.setState({ code: this.editor.getValue() });
  }

  render() {
    return (
      <textarea
        value={this.state.code}
        onChange={this._onChange}
        ref={(n) => { this._textarea = n; }}
      />
    );
  }
}

export default Editor;
