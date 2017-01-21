import React, { Component } from 'react';
import { connect } from 'react-redux';
import getDemo from './actions/demos';

class App extends Component {
  getDemo() {
    const code = this.props.demos['/home/tall/Projects/TXL_components/src/_text/TruncatedText.demo.jsx'];
    const demo = window.eval(code);
    return demo;
  }

  render() {
    if (this.props.nav._text != null && Object.keys(this.props.docs).length && !Object.keys(this.props.demos).length){
      this.props.dispatch(getDemo(this.props.nav._text[0].file));
    }

    return (
      <div>
        {this.getDemo()}
        <h1>Hello, world!</h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  demos: state.demos,
  docs: state.docs,
  nav: state.nav
});

export default connect(mapStateToProps)(App);
