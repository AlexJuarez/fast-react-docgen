import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux';

import nav from '../reducers/nav';
import docs from '../reducers/docs';
import modules from '../reducers/modules';

export default combineReducers({
  routing: routerReducer,
  nav,
  docs,
  modules,
});
