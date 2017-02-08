const defaultState = {
  categories: {},
  cwd: '',
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
