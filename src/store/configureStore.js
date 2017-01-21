// @flow

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import type { Store } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
// import state from '../state';
// import type { State } from '../state';
import DevTools from '../devtools/DevTools';
import { routerReducer } from 'react-router-redux'
import nav from '../reducers/nav';
import docs from '../reducers/docs';
import demos from '../reducers/demos';

export default function configureStore(): Store<*, *> {
  const reducer = combineReducers({
    routing: routerReducer,
    nav,
    docs,
    demos
  });

  const store = createStore(
    reducer,
    // state,
    compose(
      applyMiddleware(thunk, createLogger()),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    ),
  );

  return store;
}
