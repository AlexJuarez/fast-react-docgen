/* eslint react/prefer-stateless-function: "off",
 react/prop-types: "off", react/no-multi-comp: "off" */

import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import Navigation from 'txl/navigation/Navigation';

class LinkTemplate extends React.Component {
  render() {
    const {
      children,
      display,
      name,
      style,
      to,
    } = this.props;

    if (this.props.to) {
      return <Link {...{ children, display, name, style, to }} />;
    }

    return <span {...{ children, display, name, style }} />;
  }
}
LinkTemplate.propTypes = {
  to: PropTypes.string,
};

/** Sidebar navigation for docs. */
class NavBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      activeNames: [],
      expandedNames: [],
    };
  }

  _items() {
    return this.props.items.map(item => ({
      ...item,
      onClick: this._handleClick.bind(this, item.name),
    }));
  }

  _handleClick(name) {
    const { expandedNames } = this.state;
    const isExpanded = expandedNames.indexOf(name) !== -1;
    const newExpandedNames = isExpanded ?
      expandedNames.filter(item => item !== name) :
      [...expandedNames, name];
    this.setState({ expandedNames: newExpandedNames });
  }

  render() {
    return (
      <Navigation
        activeNames={this.state.activeNames}
        expandedNames={this.state.expandedNames}
        items={this._items()}
        template={LinkTemplate}
      />
    );
  }
}

NavBar.propTypes = {
  items: Navigation.propTypes.items,
};

export default NavBar;
