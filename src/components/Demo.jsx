// @flow
import React, { Component } from 'react';

import DemoCard from './DemoCard';
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
    return <Highlight code={this.props.code} />;
  }


  render() {
    return (
      <div>
        <div style={DOCUMENTATION_STYLE}>
          <DemoCard {...this.props} />
          {this._renderCode()}
          <div style={{ height: 20 }} />
          {this._renderProps()}
        </div>
      </div>
    )
  }
}