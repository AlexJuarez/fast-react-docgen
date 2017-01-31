// @flow
import React, { Component } from 'react';

import Container from 'txl/containers/Container';
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

export default class Demo extends Component {
  props: Props;

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
      <Container style={{ padding: '20px' }}>
        <Editor modules={modules} code={code} file={file} />
      </Container>
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
          />
          {this._renderCode()}
          <div style={{ height: 20 }} />
          {this._renderProps()}
        </div>
      </div>
    );
  }
}
