import React, { Component } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import LinkIcon from 'txl/icons/Link';
import {
  COLOR_NEUTRAL,
} from 'txl/styles/theme';
import { HEADER_TITLE_STYLES } from 'txl/containers/ExpandableContainer.style';

const HEADER_LINK = {
  ':hover': {
    color: COLOR_NEUTRAL['500'],
  },
  color: COLOR_NEUTRAL['400'],
  position: 'relative',
  textDecoration: 'none',
};

@Radium
class HeaderLink extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hovered: false,
    };

    this._handleMouseEnter = this._handleMouseEnter.bind(this);
    this._handleMouseLeave = this._handleMouseLeave.bind(this);
  }

  _handleMouseEnter() {
    this.setState({ hovered: true });
  }

  _handleMouseLeave() {
    this.setState({ hovered: false });
  }

  _renderLinkIcon() {
    if (!this.state.hovered) {
      return null;
    }

    return <span style={{ position: 'absolute', top: -15 }}><LinkIcon /></span>;
  }

  render() {
    const { category, title } = this.props;

    return (
      <div
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
      >
        <div style={{ float: 'right', marginTop: 10 }}>
          <Link
            style={{ color: COLOR_NEUTRAL['400'], fontSize: 'inherit', textDecoration: 'inherit' }}
            to={`/components/${category}`}
          >
            {category}
          </Link>
        </div>
        <h2 style={HEADER_TITLE_STYLES}>
          <span style={HEADER_LINK}>
            <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={`/components/${category}/${title}`}>
              {title}
              {this._renderLinkIcon()}
            </Link>
          </span>
        </h2>
      </div>
    );
  }
}

export default HeaderLink;
