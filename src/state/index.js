import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux';

import nav from '../reducers/nav';
import docs from '../reducers/docs';

export default combineReducers({
  routing: routerReducer,
  nav,
  docs
});
