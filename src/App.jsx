import React, { Component } from 'react';
import request from 'superagent';

export default class App extends Component {
  render() {
    request.get('api/nav', (err, res) => {
      console.log(res.body);
    });

    request.get('api/imports', (err, res) => {
      console.log(res.body);
    });

    return (
      <h1>Hello, world! 4</h1>
    );
  }
}