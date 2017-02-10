const defaultState = {
  categories: {},
  files: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'get nav data': {
      return action.payload;
    }
  }

  return state;
};
