import React, { Component } from 'react';
import { connect } from 'react-redux';

import StyleRoot from 'txl/styles/StyleRoot';
import HomeSolid from 'txl/icons/HomeSolid'

import Layout from '../components/Layout';

type File = {
  path: string,
  category: string,
  title: string,
};

type Categories = {
  [key: string]: {
    [key: string]: string,
  },
};

type Nav = {
  files?: Array<File>,
  categories?: Categories,
  cwd?: string,
};

type Props = {
  nav: ?Nav,
  children: React.Element<*>,
};

class App extends Component {
  props: Props;

  _getNavItems() {
    const { nav } = this.props;
    const { category } = this.props.params;
    const { categories } = nav;

    const items = Object.keys(categories).map(group => ({
      display: group,
      expanded: group === category,
      items: categories[group].map(item => ({
        display: item.title,
        name: `${group}/${item.title}`,
        to: `/components/${group}/${item.title}`
      })),
      name: group
    }))
      .sort((a, b) => a.name.localeCompare(b.name));

    items.unshift({
      display: <div style={{position: 'relative'}}><span style={{position: 'absolute', left: -24}}><HomeSolid /></span>Show All</div>,
      name: 'all',
      to: '/'
    });

    return items;
  }

  render() {
    const { nav, children } = this.props;

    if (!Object.keys(nav).length) {
      return null;
    }

    return (
      <StyleRoot>
        <Layout items={this._getNavItems()} activeNames={[this.props.params.title]}>
          {children}
        </Layout>
      </StyleRoot>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(App);
