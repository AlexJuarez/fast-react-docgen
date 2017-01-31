import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from 'txl/progress-indicators/LoadingIndicator';

import DemoCard from '../components/DemoCard';

class DemosPage extends Component {
  constructor(props, context) {
    super(props, context);

    this._mounted = true;
    this.state = {
      rendered: 0,
    };
  }

  componentDidMount() {
    this._mounted = true;
    this._renderMore();
  }

  componentDidUpdate() {
    this._renderMore();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _renderMore() {
    window.requestAnimationFrame(() => {
      if (this._mounted && this.state.rendered < this.props.demos.length) {
        this.setState({ rendered: this.state.rendered + 5 });
      }
    });
  }

  _getDocs(file, title) {
    const { docs } = this.props;
    if (docs.get(file) == null) {
      return {};
    }

    return docs.get(file)[title];
  }

  _renderLoader() {
    if (this.state.rendered >= this.props.demos.length) {
      return null;
    }

    return <LoadingIndicator />;
  }

  render() {
    const { demos } = this.props;

    if (demos == null) {
      return null;
    }

    const cards = demos.slice(0, this.state.rendered).map((file) => {
      const { category, title, path } = file;
      return (
        <DemoCard
          key={path}
          link
          category={category}
          title={title}
          file={path}
          docs={this._getDocs(file, title)}
        />
      );
    }).slice(0, this.state.rendered);

    return (
      <div>
        {cards}
        {this._renderLoader()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  demos: state.nav.files,
  docs: state.docs,
});

export default connect(mapStateToProps)(DemosPage);
