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
  docs: any,
  demo: ?string,
  dispatch: Dispatch
};

export default class Demo extends Component {
  props: Props;

  constructor(props: Props, context: Object) {
    super(props, context);
  }

  componentDidMount() {
    const { file, dispatch } = this.props;

    dispatch(getDemo(file));
  }

  componentWillReceiveProps(nextProps: Props) {
    const { file, dispatch } = this.props;

    if (nextProps.file !== file) {
      dispatch(getDemo(nextProps.file));
    }
  }

  _renderProps() {
    const { docs } = this.props;

    if (docs == null) {
      return null;
    }

    return <PropTable docs={docs} />;
  }

  _renderSpinner() {
    if (this.props.demo != null) {
      return null;
    }

    return <LoadingIndicator color={COLOR_ACCENT['500']} size="medium" shade="base"/>;
  }

  render() {
    const { title, docs, demo } = this.props;

    return (
      <div>
        <h1>{title}</h1>
        <div style={DOCUMENTATION_STYLE}>
          <Container>
            <div style={CONTAINER_STYLES}>
              <h2 style={HEADER_TITLE_STYLES}>Demo</h2>
              <div style={DESCRIPTION_STYLES}>{docs.description}</div>
              {this._renderSpinner()}
              <Example code={demo} />
            </div>
          </Container>
          <div style={{ height: 20 }} />
          {this._renderProps()}
        </div>
      </div>
    )
  }
}