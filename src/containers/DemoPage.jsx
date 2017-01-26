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
      return {};
    }

    return docs.get(file)[title];
  }

  render() {
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
}

const mapStateToProps = (state, ownProps) => ({
  docs: state.docs,
  nav: state.nav,
  category: ownProps.params.category,
  title: ownProps.params.title,
});

export default connect(mapStateToProps)(DemoPage);
