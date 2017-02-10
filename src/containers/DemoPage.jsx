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
    const { docs } = this.props;
    if (docs.get(file) == null) {
      return null;
    }

    return docs.get(file).get(title);
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
  category: ownProps.params.category,
  docs: state.docs,
  modules: state.modules,
  nav: state.nav,
  title: ownProps.params.title,
});

export default connect(mapStateToProps)(DemoPage);
