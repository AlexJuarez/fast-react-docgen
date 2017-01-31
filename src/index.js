import React from 'react';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';

import configureStore from './store/configureStore';
import getNavData from './actions/nav';
import getDocs from './actions/docs';
import Root from './containers/Root';

const rootNode = document.getElementById('docs');

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(getNavData());
store.dispatch(getDocs());

const render = (Component, root) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} history={history} />
    </AppContainer>,
    root
  );
};

render(Root, rootNode);

/* eslint global-require: off */

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const newRoot = require('./containers/Root');
    render(newRoot, rootNode);
  });
}

