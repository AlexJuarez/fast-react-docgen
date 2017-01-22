import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import shallowCompare from 'shallow-compare';

import type { Dispatch } from 'redux';

import StyleRoot from 'txl/styles/StyleRoot';

import Layout from './Layout';
import Demo from './Demo';
import getDemo from './actions/demos';

type Props = {
  nav: Map<string, Array<{ title: string, file: string }>>,
  docs: any,
  demos: Map<string, string>,
  dispatch: Dispatch,
  params?: {
    category?: string,
    title?: string
  }
}

class App extends Component {
  shouldComponentUpdate(nextProps: Props, nextState: Object) {
    const { category, title } = this.props.params;

    if (category !== nextProps.params.category) {
      return true;
    }

    if (title !== nextProps.params.title) {
      return true;
    }

    return shallowCompare(this, nextProps, nextState);
  }

  props: Props;

  _getNavItems() {
    const {nav} = this.props;

    return nav.keySeq().toArray().map(group => ({
      display: group,
      items: nav.get(group).map(item => ({
        display: item.title,
        name: `${group}/${item.title}`,
        to: `/${group}/${item.title}`
      })),
      name: group
    }));
  }

  _getFile() {
    const { category, title } = this.props.params;

    return this.props.nav.get(category)
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

  _getDemo(file) {
    return this.props.demos.get(file);
  }

  _renderDemo() {
    const { dispatch } = this.props;
    const { category, title } = this.props.params;

    if (category != null && title != null) {
      const file = this._getFile();

      return (
        <Demo
          category={category}
          docs={this._getDocs(file, title)}
          demo={this._getDemo(file)}
          dispatch={dispatch}
          title={title}
          file={file}
        />
      );
    }

    return null;
  }

  render() {
    if (this.props.nav.isEmpty()) {
      return null;
    }

    return (
      <StyleRoot>
        <Layout items={this._getNavItems()}>
          {this._renderDemo()}
        </Layout>
      </StyleRoot>
    );
  }
}

const mapStateToProps = (state) => ({
  demos: state.demos,
  docs: state.docs,
  nav: state.nav
});

export default connect(mapStateToProps)(App);
