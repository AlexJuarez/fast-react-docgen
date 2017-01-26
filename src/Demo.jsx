// @flow
import React, { Component } from 'react';
import type { Dispatch } from 'redux';

import LoadingIndicator from 'txl/progress-indicators/LoadingIndicator';
import Container from 'txl/containers/Container';
import { COLOR_ACCENT } from 'txl/styles/theme';
import { HEADER_TITLE_STYLES, CONTAINER_STYLES, DESCRIPTION_STYLES } from 'txl/containers/ExpandableContainer.style';
import PropTable from './PropTable';
import Example from './Example';
import {
  DOCUMENTATION_STYLE,
  DOCUMENTATION_ERROR_STYLE,
} from './styles';
import getDemo from './actions/demos';

type Props = {
  category: string,
  title: string,
  file: string,
  docs: ?any,
  demo: ?{
    code: string
  },
  dispatch: Dispatch
};

export default class Demo extends Component {
  props: Props;

  constructor(props: Props, context: Object) {
    super(props, context);

    this.state = {
      demo: require('txl/progress-indicators/DotsLoadingIndicator.demo.jsx')
    };
  }

  componentDidMount() {
    const { file, dispatch } = this.props;

    // dispatch(getDemo(file));
  }

  componentWillReceiveProps(nextProps: Props) {
    const { file, dispatch } = this.props;

    // if (nextProps.file !== file) {
    //    dispatch(getDemo(nextProps.file));
    // }
  }

  _renderProps() {
    const { docs } = this.props;

    if (docs == null) {
      return null;
    }

    return <PropTable docs={docs} />;
  }

  _renderDemo() {
    const { demo } = this.state;



    if (demo == null) {
      return <LoadingIndicator color={COLOR_ACCENT['500']} size="medium" shade="base"/>;
    }

    return demo;

  }

  _renderDescription() {
    const { docs } = this.props;

    if (docs == null) {
      return null;
    }

    return <div style={DESCRIPTION_STYLES}>{docs.description}</div>;
  }

  render() {
    const { title } = this.props;

    return (
      <div>
        <h1>{title}</h1>
        <div style={DOCUMENTATION_STYLE}>
          <Container>
            <div style={CONTAINER_STYLES}>
              <h2 style={HEADER_TITLE_STYLES}>Demo</h2>
              {this._renderDescription()}
              {this._renderDemo()}
            </div>
          </Container>
          <div style={{ height: 20 }} />
          {this._renderProps()}
        </div>
      </div>
    )
  }
}