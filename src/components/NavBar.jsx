/* eslint react/prefer-stateless-function: "off",
 react/prop-types: "off", react/no-multi-comp: "off" */

import React, { Component, PropTypes } from 'react';
import NavigationBase from 'txl/navigation/NavigationBase';
import NavigationItems from 'txl/navigation/NavigationItems';

import LinkTemplate from './LinkTemplate';

/** Sidebar navigation for docs. */
class NavBar extends Component {
  constructor(props, context) {
    super(props, context);

    const { activeNames, items } = props;

    this._onUpdate = this._onUpdate.bind(this);

    this.state = {
      items: new NavigationItems({ activeNames, defaultTemplate: LinkTemplate, items }),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { search, activeNames, expandedNames } = nextProps;

    let isHighlighted = () => false;
    if (search != null) {
      const re = new RegExp(search.split('').map(t => `(${t})`).join('(.*)'), 'ig');
      isHighlighted = name => re.test(name);
    }

    const updateSearch = (group) => {
      if (isHighlighted(group.display)) {
        return group.setIn(['meta', 'search'], search);
      } else if (group.meta.get('search') != null) {
        return group.setIn(['meta', 'search'], null);
      }

      return group;
    };

    this.state.items.update(updateSearch, updateSearch);

    if (activeNames != null && activeNames.length) {
      this.state.items.updateActive(activeNames);
    }

    if (expandedNames != null && expandedNames.length) {
      this.state.items.updateExpanded(expandedNames);
    }

    this.setState({ items: this.state.items });
  }

  _onUpdate(group, update) {
    this.state.items.updateGroup(group, update);

    this.setState({ items: this.state.items });
  }

  render() {
    const { items } = this.state;

    return (
      <NavigationBase
        onUpdate={this._onUpdate}
        items={items}
      />
    );
  }
}

NavBar.propTypes = {
  search: PropTypes.string,
};

export default NavBar;
