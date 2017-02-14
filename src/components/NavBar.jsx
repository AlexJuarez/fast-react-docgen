/* eslint react/prefer-stateless-function: "off",
 react/prop-types: "off", react/no-multi-comp: "off" */

import React, { Component } from 'react';
import { Router } from 'react-router';
import NavigationBase from 'txl/navigation/NavigationBase';
import NavigationItems from 'txl/navigation/NavigationItems';
import SearchBox from 'txl/input-fields/SearchBox';
import { STYLES } from 'txl/navigation/Navigation.style';
import shallowCompare from 'shallow-compare';

import { NAVBAR_STYLE } from '../styles';
import LinkTemplate from './LinkTemplate';

type Props = {
  router: Router,
  items: any,
  title?: string,
  category?: string,
};

/** Sidebar navigation for docs. */
class NavBar extends Component {
  constructor(props, context) {
    super(props, context);

    const { title, items } = props;

    this._onUpdate = this._onUpdate.bind(this);

    this._handleChange = this._handleChange.bind(this);
    this._handleClear = this._handleClear.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);

    this.state = {
      items: new NavigationItems({ activeNames: [title], defaultTemplate: LinkTemplate, items }),
    };
  }

  componentDidMount() {
    const { router } = this.props;
    const location = router.getCurrentLocation();
    this._updateSearch(location.query.search);
  }

  componentWillReceiveProps(nextProps) {
    const { title, category } = this.props;

    if (nextProps.title !== title || nextProps.category !== category) {
      this.setState(prevState =>
        ({
          items: prevState.items
            .updateActive([nextProps.title])
            .updateExpanded([nextProps.category]),
        })
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  _updateSearch(search = '') {
    const re = new RegExp(search
        .split('')
        .map(t => `([${t}])`)
        .join('(.*?)'),
      'i'
    );
    const isHighlighted = name => search.length && re.test(name);

    const update = (group) => {
      if (isHighlighted(group.display)) {
        return group.setIn(['meta', 'search'], search);
      } else if (group.meta.get('search') != null) {
        return group.setIn(['meta', 'search'], null);
      }

      return group;
    };

    const predicate = group => isHighlighted(group.display)
      || (group.meta.get('search') != null && !isHighlighted(group.display))
      || group.expanded;

    this.setState(prevState => ({
      items: prevState.items.update({ predicate, update }, { update }),
      search,
    }));
  }

  _addQuery(name, value) {
    const { router } = this.props;
    const location = router.getCurrentLocation();
    location.query[name] = value;
    router.replace(location);

    this._updateSearch(value);
  }

  _removeQuery(name) {
    const { router } = this.props;
    const location = router.getCurrentLocation();
    delete location.query[name];
    router.replace(location);

    this._updateSearch('');
  }

  _handleClear() {
    this._removeQuery('search');
  }

  _handleChange(e) {
    if (!e.value.length) {
      this._removeQuery('search');
    } else {
      this._addQuery('search', e.value);
    }
  }

  _handleSubmit() {
    const { router } = this.props;

    const location = router.getCurrentLocation();
    location.pathname = '/';
    router.push(location);
  }

  props: Props;

  _onUpdate(predicate, update) {
    this.setState(prevState => ({ items: prevState.items.updateGroup(predicate, update) }));
  }

  render() {
    const { items, search } = this.state;

    return (
      <div style={NAVBAR_STYLE}>
        <div style={{ ...STYLES.container.base, minHeight: 'auto' }}>
          <SearchBox
            placeholder="Search"
            value={search}
            onClear={this._handleClear}
            onChange={this._handleChange}
            onSubmit={this._handleSubmit}
          />
        </div>
        <NavigationBase
          onUpdate={this._onUpdate}
          items={items}
        />
      </div>
    );
  }
}

export default NavBar;
