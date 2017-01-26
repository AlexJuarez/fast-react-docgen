import React, { Component } from 'react';
import { Link } from 'react-router';

import demoMap from '../demoMap';
import Container from 'txl/containers/Container';
import {
  HEADER_TITLE_STYLES,
  CONTAINER_STYLES,
  DESCRIPTION_STYLES
} from 'txl/containers/ExpandableContainer.style';

type Props = {
  category: string,
  docs: ?any,
  file: string,
  link: boolean,
  title: string,
};
class DemoCard extends Component {
  props: Props;

  static defaultProps = {
    link: false,
  };

  _renderDocsLink() {
    const { category, link, title } = this.props;
    if (!link) {
      return null;
    }

    return <sup><Link to={`/components/${category}/${title}`}>docs</Link></sup>;
  }

  _renderDescription() {
    const { docs } = this.props;

    if (docs == null) {
      return null;
    }

    return <div style={DESCRIPTION_STYLES}>{docs.description}</div>;
  }

  _renderDemo() {
    const DemoFile = demoMap[this.props.file];
    return <DemoFile />;
  }

  render() {
    const { title } = this.props;

    return (
      <div style={{ marginBottom: 20 }}>
        <Container>
          <div style={CONTAINER_STYLES}>
            <h2 style={HEADER_TITLE_STYLES}>
              {title}
              {this._renderDocsLink()}
            </h2>
            {this._renderDescription()}
            {this._renderDemo()}
          </div>
        </Container>
      </div>
    )
  }
}

export default DemoCard;
