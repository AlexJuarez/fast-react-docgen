import React, { Component } from 'react';
import Container from 'txl/containers/Container';
import {
  CONTAINER_STYLES,
  DESCRIPTION_STYLES,
} from 'txl/containers/ExpandableContainer.style';
import shallowCompare from 'shallow-compare';

import demoMap from '../demoMap';
import HeaderLink from './HeaderLink';

type Props = {
  category: string,
  docs: ?any,
  file: string,
  title: string,
  demo: ?React.Element<*>,
};

class DemoCard extends Component {
  static defaultProps = {
    link: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  props: Props;


  _renderDescription() {
    const { docs } = this.props;

    if (docs == null) {
      return null;
    }

    return <div style={DESCRIPTION_STYLES}>{docs.get('description')}</div>;
  }

  _renderDemo() {
    const { demo } = this.props;

    if (demo != null) {
      return demo;
    }

    const DemoFile = demoMap[this.props.file];
    return <DemoFile />;
  }

  render() {
    const { category, title } = this.props;

    return (
      <div style={{ marginBottom: 20 }}>
        <Container>
          <div style={CONTAINER_STYLES}>
            <HeaderLink title={title} category={category} />
            {this._renderDescription()}
            {this._renderDemo()}
          </div>
        </Container>
      </div>
    );
  }
}

export default DemoCard;
