// @flow
import React, { Component } from 'react';

import {
  render,
  unmountComponentAtNode,
} from 'react-dom';
import StyleRoot from 'txl/styles/StyleRoot';

type Props = {
  code: string,
  styleRoot: boolean,
};

export default class Example extends Component {
  props: Props;

  componentDidMount() {
    this._renderExample();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.code !== nextProps.code;
  }

  componentDidUpdate() {
    this._renderExample();
  }

  _renderExample() {
    if (this.props.code == null) {
      return null;
    }

    let element;
    try {
      /* eslint no-eval: 0 */
      element = window.eval(`((__REACT_HOT_LOADER__) => { return ${this.props.code} })();`);
    } catch (err) {
      element = <div>{err.message}</div>
    }

    unmountComponentAtNode(this._ref);

    if (this.props.styleRoot) {
      element = <StyleRoot>{element}</StyleRoot>;
    }

    try {
      render(element, this._ref);
    } catch (err) {
      render(<div>{err.message}</div>, this._ref);
    }
  }

  render() {
    return <div ref={(n) => { this._ref = n; }} />;
  }
}
