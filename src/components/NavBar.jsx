/* eslint react/prefer-stateless-function: "off",
 react/prop-types: "off", react/no-multi-comp: "off" */

import React, { Component, PropTypes } from 'react';
import NavigationBase from 'txl/navigation/NavigationBase';
import NavigationItems from 'txl/navigation/NavigationItems';
import { COLOR_ACCENT } from 'txl/styles/theme';

const HIGHLIGHT_STYLE = {
  background: 'rgb(255, 191, 109)',
};

class LinkTemplate extends React.Component {
  render() {
    const {
      active,
      display,
      router,
      style,
      to,
    } = this.props;

    if (active) {
      style.backgroundColor = COLOR_ACCENT['500'];
    }

    const highlight = (name, r) => {
      if (typeof name !== 'string' || r == null) {
        return name;
      }

      const { query } = r.getCurrentLocation();
      if (query.search == null || !query.search.length) {
        return name;
      }

      const re = new RegExp(query.search.split('').map(t => `(${t})`).join('(.*)'), 'ig');
      const matches = re.exec(name);
      if (matches == null) {
        return name;
      }
      const [match, ...rest] = matches;
      const highlights = rest.map((v, i) => {
        if (i % 2 === 0) {
          return <span key={i} style={HIGHLIGHT_STYLE}>{v}</span>;
        }

        return v;
      });

      const index = name.indexOf(match);

      return (
        <span>
          {name.substr(0, index)}
          {highlights}
          {name.substr(index + match.length)}
        </span>
      );
    };

    const onClick = () => {
      if (to != null) {
        const location = router.getCurrentLocation();
        location.pathname = to;
        router.push(location);
      }
    };

    return (
      <span {...{ name, onClick, style }}>
        {highlight(display, router)}
      </span>
    );
  }
}
LinkTemplate.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

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
    if (search != null) {
      const re = new RegExp(search.split('').map(t => `(${t})`).join('(.*)'), 'ig');

      const updateGroup = (group) => {
        if (re.test(group.display)) {
          return group.setIn(['meta', 'search'], search);
        } else if (group.meta.get('search') != null) {
          return group.setIn(['meta', 'search'], null);
        }

        return group;
      };

      this.state.items.update(updateGroup, updateGroup);
    }

    if (this.props.search != null && search == null) {
      const updateGroup = (group) => {
        if (group.meta.get('search') != null) {
          return group.setIn(['meta', 'search'], null);
        }

        return group;
      };

      this.state.items.update(updateGroup, updateGroup);
    }

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
