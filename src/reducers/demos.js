import { Map } from 'immutable';

export default (state = Map(), action) => {
  switch(action.type) {
    case 'get demo': {
      const { file, code } = action.payload;
      if (state.get(file) !== code) {
        return state.set(file, code);
      }
    }
  }

  return state;
}