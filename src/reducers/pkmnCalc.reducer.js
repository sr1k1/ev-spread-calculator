const actions = {
  setSmogonPkmnPool: "setSmogonPkmnPool",
  setGlobalPkmnPool: "setGlobalPkmnPool",
  calculateResult: "calculateResult",
};

const initialState = {
  smogonPkmnPool: "",
  globalPkmnPool: "",
  isResultCalculated: false,
};

// Potential room for error: reducer always uses initialState as default; resets progress?
function reducer(state = initialState, action) {
  switch (action.type) {
    case "setSmogonPkmnPool":
      return {
        ...state,
        smogonPkmnPool: action.pkmnSmogonSets,
      };

    case "setGlobalPkmnPool":
      return {
        ...state,
        globalPkmnPool: action.pkmnEndpoints,
      };

    case "calculateResult":
      return {
        ...state,
        isResultCalculated: true,
      };
  }
  return;
}

export { reducer, actions, initialState };
