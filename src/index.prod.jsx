import React from 'react';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { hashHistory } from 'react-router';

import configureStore from './store/configureStore';
import getNavData from './actions/nav';
import getDocs from './actions/docs';
import getModules from './actions/modules';
import Root from './containers/Root';

const rootNode = document.getElementById('docs');

const store = configureStore();

const history = syncHistoryWithStore(hashHistory, store);

store.dispatch(getNavData());
store.dispatch(getDocs());
store.dispatch(getModules());

ReactDOM.render(
  <Root store={store} history={history} />,
  rootNode
);
