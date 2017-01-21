import { createReducer } from 'redux-action'

const defaultState = {};

export default createReducer(defaultState, {
  'get demo': ({ file, code }, state) => ({ [file]: code, ...state })
});
