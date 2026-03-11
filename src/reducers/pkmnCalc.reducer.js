const actions = {
  setSmogonPkmnPool: "setSmogonPkmnPool",
  setGlobalPkmnPool: "setGlobalPkmnPool",
  calculateResult: "calculateResult",
  setPageTitle: "setPageTitle",
  setLoadError: "setLoadError",
  isLoading: "false",
  isSaving: "true",
  loadTeam: "loadTeam",
};

const initialState = {
  smogonPkmnPool: "",
  globalPkmnPool: "",
  isResultCalculated: false,
  pageTitle: "",
  errorMessage: "",
  saving: false,
  loading: false,
};

// Potential room for error: reducer always uses initialState as default; resets progress?
function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.setSmogonPkmnPool:
      return {
        ...state,
        smogonPkmnPool: action.pkmnSmogonSets,
      };

    case actions.setGlobalPkmnPool:
      return {
        ...state,
        globalPkmnPool: action.pkmnEndpoints,
      };

    case actions.calculateResult:
      return {
        ...state,
        isResultCalculated: true,
      };

    case actions.setPageTitle:
      return {
        ...state,
        pageTitle: action.pageTitle,
      };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: actions.error.message,
      };

    case actions.isLoading:
      return {
        ...state,
        isLoading: actions.loadState,
      };
    case actions.isSaving:
      return {
        ...state,
        isSaving: actions.saveState,
      };
    case actions.loadTeam:
      return {};
  }
  return;
}

export { reducer, actions, initialState };
