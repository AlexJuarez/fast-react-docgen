import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, browserHistory, Route } from 'react-router';

import App from './App';
import configureStore from './store/configureStore';
import getNavData from './actions/nav';
import getDocs from './actions/docs';

const rootNode = document.getElementById('docs');

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(getNavData());
store.dispatch(getDocs());

const render = (Component, root) => {
  ReactDOM.render(
    <Provider store={store} key="provider">
      <Router history={history}>
        <Route path=":category/:title" component={Component} />
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

