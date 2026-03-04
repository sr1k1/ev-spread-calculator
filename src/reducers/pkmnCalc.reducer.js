const actions = {
  setPkmnPool: "setPkmnPool",
};

const initialState = {
  pkmnPool: "",
};

// Potential room for error: reducer always uses initialState as default; resets progress?
function reducer(state = initialState, action) {
  switch (action.type) {
    case "setPkmnPool":
      return {
        ...state,
        pkmnPool: action.pokemon,
      };
  }
  return;
}

export { reducer, actions, initialState };
