// @flow
import React, { Component } from 'react';

import Container from 'txl/containers/Container';
import Button from 'txl/buttons/Button';
import GearIcon from 'txl/icons/Gear';
import DemoCard from './DemoCard';
import Editor from './Editor';
import Highlight from './Highlight';
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
  demo: React.Element<*>,
};

export default class Demo extends Component {
  constructor(props: Props, context: Object) {
    super(props, context);
    this.state = {
      code: props.code,
      demo: null,
      editMode: false,
    };

    this._toggleEditMode = this._toggleEditMode.bind(this);
  }

  props: Props;
  state: State;

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.file != this.props.file) {
      this.setState({ editMode: false, demo: null });
    }
  }

  _toggleEditMode() {
    if (this.state.demo != null) {
      const c = confirm('You are about to leave Live Edit mode, the demo changes will be lost');
      if (c) {
        this.setState({ editMode: !this.state.editMode, demo: null });
      }
    }  else {
      this.setState({ editMode: !this.state.editMode });
    }
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

    let elem;

    if (this.state.editMode) {
      elem = (
        <Editor
          modules={modules}
          code={code}
          file={file}
          onChange={(code) => { this.setState({ code })}}
        />
      );
    } else {
      elem = <Highlight code={code} />
    }

    return (
      <Container style={{ padding: 20 }} >
        {elem}
      </Container>
    );
  }

  _renderRunButton() {
    if (!this.state.editMode) {
      return null;
    }

    return (
      <Button
        size="large"
        _style={{ marginRight: 10, backgroundColor: ''}}
      >
        Run
      </Button>
    )
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
              <Button
                variant="accent"
                size="large"
                onClick={this._toggleEditMode}
              >
                <span style={{ position: 'relative', top: 2, marginRight: 5 }}><GearIcon color="#ffffff" /></span>
                Toggle Live Edit
              </Button>
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
