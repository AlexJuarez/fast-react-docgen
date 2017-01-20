import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, browserHistory } from 'react-router';

const rootNode = document.getElementById('docs');

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const render = (Component, root) => {
  ReactDOM.render(
    <Provider store={store} key="provider">
      <Router history={history}>
        <Route path="/" component={Component} />
      </Router>
    </Provider>,
    root
  );
};

render(App, rootNode);

if (module.hot) {
  module.hot.accept('./App', () => {
    const newApp = require('./App');
    render(newApp, rootNode);
  });
}

