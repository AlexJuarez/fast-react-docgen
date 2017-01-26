import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import shallowCompare from 'shallow-compare';

import type { Dispatch } from 'redux';

import StyleRoot from 'txl/styles/StyleRoot';

import Layout from './Layout';
import Demo from './Demo';
import DemoCard from './DemoCard';

type Props = {
  nav: Map<string, Array<{ title: string, file: string }>>,
  docs: any,
  dispatch: Dispatch,
  category: ?string,
  title: ?string,
}

class App extends Component {
  shouldComponentUpdate(nextProps: Props, nextState: Object) {
    return shallowCompare(this, nextProps, nextState);
  }

  props: Props;

  _getNavItems() {
    const {nav, category} = this.props;
    const { categories } = nav;

    const items = Object.keys(categories).map(group => ({
      display: group,
      expanded: (category === group),
      items: categories[group].map(item => ({
        display: item.title,
        name: `${group}/${item.title}`,
        to: `/${group}/${item.title}`
      })),
      name: group
    }))
      .sort((a, b) => a.name.localeCompare(b.name));

    items.unshift({
      display: 'Show All',
      name: 'all',
      to: '/'
    });

    return items;
  }

  _getFile() {
    const { category, title } = this.props;

    return this.props.nav.categories[category]
      .filter(i => i.title === title)
      .pop()
      .file;
  }

  _getDocs(file, title) {
    const { docs } = this.props;
    if (docs.get(file) == null) {
      return {};
    }

    return docs.get(file)[title];
  }

  _renderDemoPage() {
    const { category, title } = this.props;

    if (category == null || title == null) {
      return null;
    }

    const file = this._getFile();

    return (
      <Demo
        category={category}
        docs={this._getDocs(file, title)}
        title={title}
        file={file}
      />
    );
  }

  _renderDemos() {
    const { nav } = this.props;

    const { files } = nav;

    if (this.props.category != null || this.props.title != null) {
      return null;
    }

    return files.map(file => {
        const { category, title, path } = file;
        return (
          <DemoCard
            link={true}
            category={category}
            title={title}
            file={path}
            docs={this._getDocs(file, title)}
          />
        );
      }
    )
  }

  render() {
    if (!Object.keys(this.props.nav).length) {
      return null;
    }

    return (
      <StyleRoot>
        <Layout items={this._getNavItems()} activeNames={[this.props.title]}>
          {this._renderDemoPage()}
          {this._renderDemos()}
        </Layout>
      </StyleRoot>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  docs: state.docs,
  nav: state.nav,
  category: ownProps.params.category,
  title: ownProps.params.title,
});

export default connect(mapStateToProps)(App);
