import { Map } from 'immutable';

export default (state = Map(), action) => {
  switch(action.type) {
    case 'get nav data': {
      return Map(action.payload);
    }
  }

  return state;
};
