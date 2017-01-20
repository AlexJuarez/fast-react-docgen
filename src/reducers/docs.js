import { createReducer } from 'redux-action'

const defaultState = {};

export default createReducer(defaultState, {
  'get docs': payload => (payload)
});
