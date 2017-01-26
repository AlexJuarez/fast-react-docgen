import { createStore, applyMiddleware, compose } from 'redux';
import type { Store } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import DevTools from '../devtools/DevTools';
import state from '../state';

function getMiddleware() {
  const middleware = [thunk];
  if (window.enableReduxLogger) {
    middleware.push(createLogger());
  }

  return applyMiddleware(...middleware);
}

export default function configureStore(initialState): Store<*, *> {
  const store = createStore(
    state,
    initialState,
    compose(
      getMiddleware(),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    ),
  );

  if (module.hot) {
    module.hot.accept('../state', () => {
      const nextState = require('../state').default;
      store.replaceReducer(nextState);
    });
  }

  return store;
}
