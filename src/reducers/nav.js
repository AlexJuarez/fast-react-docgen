import { createReducer } from 'redux-action'

const defaultState = {};

export default createReducer(defaultState, {
  'get nav data': payload => (payload)
});
