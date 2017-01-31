import React, { Component } from 'react';
import { connect } from 'react-redux';

import Demo from '../components/Demo';

class DemoPage extends Component {
  _getFile() {
    const { category, title } = this.props;

    return this.props.nav.categories[category]
      .filter(i => i.title === title)
      .pop()
      .file;
  }

  _getDocs(file, title) {
    const {docs} = this.props;
    if (docs.get(file) == null) {
      return {};
    }

    return docs.get(file)[title];
  }

  _getCode(file) {
    return this.props.nav.files
      .filter(({ path }) => path === file)
      .pop()
      .code;
  }

  render() {
    const { category, modules, title } = this.props;

    if (category == null || title == null) {
      return null;
    }

    const file = this._getFile();

    return (
      <Demo
        category={category}
        code={this._getCode(file)}
        docs={this._getDocs(file, title)}
        modules={modules}
        title={title}
        file={file}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  docs: state.docs,
  nav: state.nav,
  modules: state.modules,
  category: ownProps.params.category,
  title: ownProps.params.title,
});

export default connect(mapStateToProps)(DemoPage);
