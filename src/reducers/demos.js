import { Map } from 'immutable';

export default (state = Map(), action) => {
  switch(action.type) {
    case 'get demo': {
      const { file, result } = action.payload;
      if (state.get(file) !== result.code) {
        return state.set(file, result);
      }
    }
  }

  return state;
}