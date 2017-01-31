import React, { Component } from 'react';
import CodeMirror from 'codemirror';

require('codemirror/mode/jsx/jsx');
require('codemirror/lib/codemirror.css');
require('./codemirror.css')


type Props = {
  code: string,
  onChange: (demo: ?React.Element<*>) => void,
};

type State = {
  code: string,
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
    const newCode = this.editor.getValue();
    this.props.onChange(newCode);
    this.setState({ code: newCode });
  }

  render() {
    return (
      <div>
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
