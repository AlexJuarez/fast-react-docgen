export default (state = [], action) => {
  switch (action.type) {
    case 'get modules': {
      return action.payload;
    }
  }

  return state;
};
