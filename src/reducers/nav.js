export default (state = {}, action) => {
  switch (action.type) {
    case 'get nav data': {
      return action.payload;
    }
  }

  return state;
};
