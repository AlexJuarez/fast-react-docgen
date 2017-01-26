/* eslint react/prefer-stateless-function: "off",
 react/prop-types: "off", react/no-multi-comp: "off" */

import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import Navigation from 'txl/navigation/Navigation';
import { COLOR_ACCENT } from 'txl/styles/theme';

class LinkTemplate extends React.Component {
  render() {
    const {
      children,
      display,
      name,
      style,
      to,
      active
    } = this.props;

    if (active) {
      style.backgroundColor = COLOR_ACCENT['500'];
    }

    if (to != null) {
      return <Link {...{ display, name, style, to }}>{children}</Link>;
    }

    return <span {...{ display, name, style }}>{children}</span>;
  }
}
LinkTemplate.propTypes = {
  to: PropTypes.string,
};

/** Sidebar navigation for docs. */
class NavBar extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Navigation
        activeNames={this.props.activeNames}
        items={this.props.items}
        template={LinkTemplate}
      />
    );
  }
}

NavBar.propTypes = {
  items: Navigation.propTypes.items,
  activeNames: Navigation.propTypes.activeNames,
};

export default NavBar;
