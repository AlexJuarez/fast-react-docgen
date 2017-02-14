// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Router } from 'react-router';
import StyleRoot from 'txl/styles/StyleRoot';
import HomeIcon from 'txl/icons/HomeSolid';
import shallowCompare from 'shallow-compare';

import formatTitle from '../helpers/formatTitle';
import Layout from '../components/Layout';

type File = {
  code: string,
  path: string,
  category: string,
  title: string,
};

type Demo = {
  file: string,
  title: string,
};

type Categories = {
  [key: string]: Array<Demo>,
};

/* eslint react/no-unused-prop-types: off */
type Nav = {
  files: Array<File>,
  categories: Categories,
};

type Props = {
  nav: Nav,
  title: ?string,
  category: ?string,
  router: Router,
  children: React.Element<*>,
};

class App extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  props: Props;

  _getNavItems() {
    const { nav, category, router } = this.props;
    const { categories } = nav;

    const items = Object.keys(categories).map(group => ({
      display: formatTitle(group),
      expanded: group === category,
      items: categories[group].map(item => ({
        display: formatTitle(item.title),
        name: item.title,
        router,
        to: `/components/${group}/${item.title}`,
      })),
      name: group,
      router,
    }))
      .sort((a, b) => a.display.localeCompare(b.display));

    items.unshift(
      {
        display: (
          <div style={{ position: 'relative' }}>
            <span style={{ left: -24, position: 'absolute' }}><HomeIcon /></span>
            Show All
          </div>
        ),
        name: 'all',
        router,
        to: '/',
      }
    );

    return items;
  }

  render() {
    const { nav, children, router } = this.props;

    if (!Object.keys(nav.files).length) {
      return null;
    }

    return (
      <StyleRoot>
        <Layout
          items={this._getNavItems()}
          title={this.props.title}
          category={this.props.category}
          router={router}
        >
          {children}
        </Layout>
      </StyleRoot>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  category: ownProps.params.category,
  nav: state.nav,
  title: ownProps.params.title,
});

export default connect(mapStateToProps)(props => (
  <App
    router={props.router}
    nav={props.nav}
    category={props.category}
    title={props.title}
  >
    {props.children}
  </App>
));
