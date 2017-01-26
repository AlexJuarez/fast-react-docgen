// @flow
import React, { Component } from 'react';

import DemoCard from './DemoCard';
import PropTable from './PropTable';
import {
  DOCUMENTATION_STYLE,
} from './styles';

type Props = {
  category: string,
  title: string,
  file: string,
  docs: ?any
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

  render() {
    return (
      <div>
        <div style={DOCUMENTATION_STYLE}>
          <DemoCard {...this.props} />
          {this._renderProps()}
        </div>
      </div>
    )
  }
}