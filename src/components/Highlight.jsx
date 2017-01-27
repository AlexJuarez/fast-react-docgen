import React, { Component } from 'react';
import Prism from 'prismjs';
import Container from 'txl/containers/Container';

require('prismjs/themes/prism.css');

class Hightlight extends Component {
  componentDidMount() {
    const { code } = this.props;

    this._ref.innerHTML = Prism.highlight(code, Prism.languages.javascript);
  }

  componentDidUpdate() {
    const { code } = this.props;

    this._ref.innerHTML = Prism.highlight(code, Prism.languages.javascript);
  }

  render() {
    return (
      <Container style={{ padding: '20px' }}>
        <code style={{ overflow: 'auto', width: '100%', display: 'block' }}>
          <pre ref={(n) => { this._ref = n; }} />
        </code>
      </Container>
    );
  }
}

export default Hightlight;
