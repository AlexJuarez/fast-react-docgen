import Immutable, { Map } from 'immutable';

export default (state = Map(), action) => {
  switch (action.type) {
    case 'get docs': {
      return Immutable.fromJS(action.payload);
    }
  }

  return state;
};
