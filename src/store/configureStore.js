// @flow

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import type { Store } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import DevTools from '../devtools/DevTools';
import { routerReducer } from 'react-router-redux'
import nav from '../reducers/nav';
import docs from '../reducers/docs';

export default function configureStore(): Store<*, *> {
  const reducer = combineReducers({
    routing: routerReducer,
    nav,
    docs
  });

  const middleware = [thunk];
  if (window.enableReduxLogger) {
    middleware.push(createLogger());
  }

  const store = createStore(
    reducer,
    compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    ),
  );

  return store;
}
