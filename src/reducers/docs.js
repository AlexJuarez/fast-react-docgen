import { Map } from 'immutable';

export default (state = Map(), action) => {
  switch(action.type) {
    case 'get docs': {
      return Map(action.payload);
    }
  }

  return state;
};
