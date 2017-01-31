// @flow
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import Container from 'txl/containers/Container';
import Button from 'txl/buttons/Button';
import CodeIcon from 'txl/icons/Code';

import executeCode from '../helpers/execute-module';
import DemoCard from './DemoCard';
import Editor from './Editor';
import PropTable from './PropTable';
import {
  DOCUMENTATION_STYLE,
} from '../styles';

type Props = {
  category: string,
  title: string,
  file: string,
  docs: ?any,
  code: ?string,
  modules: ?any,
};

type State = {
  editMode: boolean,
  code: string,
  demo: ?React.Element<*>,
};

export default class Demo extends Component {
  constructor(props: Props, context: Object) {
    super(props, context);
    this.state = {
      code: props.code,
      demo: null,
      editMode: true,
    };

    this._executeCode = debounce(this._executeCode.bind(this), 500, { maxWait: 2000 });
    this._handleCodeChange = this._handleCodeChange.bind(this);
    this._toggleEditMode = this._toggleEditMode.bind(this);
  }

  state: State;

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.file !== this.props.file) {
      this.setState({ demo: null, editMode: false });
    }
  }

  props: Props;

  _executeCode: () => void;
  _handleCodeChange: () => void;
  _toggleEditMode: () => void;

  _toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
  }

  _executeCode() {
    this.setState({ demo: executeCode(this.state.code, this.props.file, this.props.modules) });
  }

  _handleCodeChange(code: string) {
    if (this.state.editMode) {
      this._executeCode();
    }

    this.setState({ code });
  }

  _renderProps() {
    const { docs } = this.props;

    if (docs == null) {
      return null;
    }

    return <PropTable docs={docs} />;
  }

  _renderCode() {
    const { code, modules, file } = this.props;

    return (
      <Container style={{ padding: 20 }} >
        <Editor
          modules={modules}
          code={code}
          file={file}
          onChange={this._handleCodeChange}
        />
      </Container>
    );
  }

  _renderRunButton() {
    if (this.state.editMode) {
      return null;
    }

    return (
      <Button
        onClick={this._executeCode}
        size="large"
        _style={{ marginRight: 10 }}
      >
        Run
      </Button>
    );
  }

  _renderLiveEditButton() {
    return (
      <Button
        variant="accent"
        size="large"
        onClick={this._toggleEditMode}
      >
        <span
          style={{ marginRight: 5, position: 'relative', top: 2 }}
        >
          <CodeIcon color="#ffffff" />
        </span>
        {this.state.editMode ? 'Deactivate' : 'Activate'} Live Edit
      </Button>
    );
  }

  render() {
    const { category, title, file, docs, code } = this.props;

    return (
      <div>
        <div style={DOCUMENTATION_STYLE}>
          <DemoCard
            category={category}
            title={title}
            file={file}
            docs={docs}
            code={code}
            demo={this.state.demo}
          />
          <Container style={{ marginBottom: 20, padding: 10 }}>
            <div style={{ textAlign: 'right' }}>
              {this._renderRunButton()}
              {this._renderLiveEditButton()}
            </div>
          </Container>
          {this._renderCode()}
          <div style={{ height: 20 }} />
          {this._renderProps()}
        </div>
      </div>
    );
  }
}
