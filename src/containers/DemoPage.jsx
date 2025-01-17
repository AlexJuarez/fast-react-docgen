import React, { Component } from 'react';
import { connect } from 'react-redux';
import shallowCompare from 'shallow-compare';

import Demo from '../components/Demo';

class DemoPage extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  _getInfo() {
    const { category, title, nav } = this.props;

    return nav.files
      .filter(i => i.title === title && i.category === category)
      .pop();
  }

  _getDocs(id, title) {
    const { docs } = this.props;

    return docs.getIn([`${id}`, title]);
  }

  render() {
    const { category, modules, title } = this.props;

    if (category == null || title == null) {
      return null;
    }

    const { path, code, id } = this._getInfo();

    return (
      <Demo
        category={category}
        code={code}
        docs={this._getDocs(id, title)}
        modules={modules}
        title={title}
        file={path}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  category: ownProps.params.category,
  docs: state.docs,
  modules: state.modules,
  nav: state.nav,
  title: ownProps.params.title,
});

const demoPage = props => (
  <DemoPage
    category={props.category}
    docs={props.docs}
    modules={props.modules}
    nav={props.nav}
    title={props.title}
  />
);

export default connect(mapStateToProps)(demoPage);
