// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Router } from 'react-router';
import StyleRoot from 'txl/styles/StyleRoot';
import HomeIcon from 'txl/icons/HomeSolid';

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
  cwd: string,
};

type Props = {
  nav: Nav,
  params: Object,
  router: Router,
  children: React.Element<*>,
};

class App extends Component {
  props: Props;

  _getNavItems() {
    const { nav, params, router } = this.props;
    const { category } = params;
    const { categories } = nav;

    const items = Object.keys(categories).map(group => ({
      display: group,
      expanded: group === category,
      items: categories[group].map(item => ({
        display: item.title,
        name: `${group}/${item.title}`,
        router,
        to: `/components/${group}/${item.title}`,
      })),
      name: group,
      router,
    }))
      .sort((a, b) => a.name.localeCompare(b.name));

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
    const { nav, children, search, router } = this.props;

    if (!Object.keys(nav.files).length) {
      return null;
    }

    return (
      <StyleRoot>
        <Layout
          search={search}
          items={this._getNavItems()}
          activeNames={[this.props.params.title]}
          expandedNames={[this.props.params.category]}
          router={router}
        >
          {children}
        </Layout>
      </StyleRoot>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  nav: state.nav,
  search: ownProps.location.query.search,
});

export default connect(mapStateToProps)(App);
