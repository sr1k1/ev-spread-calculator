const actions = {
  setSmogonPkmnPool: "setSmogonPkmnPool",
  setGlobalPkmnPool: "setGlobalPkmnPool",
  calculateResult: "calculateResult",
  setPageTitle: "setPageTitle",
  setLoadError: "setLoadError",
  isLoading: "false",
  isSaving: "true",
  loadTeam: "loadTeam",
  saveEvSpread: "saveEvSpread",
  setCalcdPkmnEv: "setCalcdPkmnEv",
  revertSavedTeam: "revertSavedTeam",
  deleteEvSpread: "deleteEvSpread",
  alterSavedTeam: "alterSavedTeam",
  setTeamTitle: "setTeamTitle",
  revertTitle: "revertTitle",
};

const initialState = {
  smogonPkmnPool: "",
  globalPkmnPool: "",
  isResultCalculated: false,
  pageTitle: "",
  errorMessage: "",
  saving: false,
  loading: false,
  recordId: "",
  savedTeam: { members: { 1: { id: 3455, name: "waxen", evSpread: "None" } } },
  teamTitle: "",
  oldTitle: "",
  savedTeamSafeCopy: {},
  calcdPkmnEv: {
    name: "Pokemon 2.0",
    id: 3455,
    message: "This is a sample text",
    nature: "Jolly",
    evSpread: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  },
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
        errorMessage: action.error.message,
      };

    case actions.isLoading:
      return {
        ...state,
        isLoading: action.loadState,
      };
    case actions.isSaving:
      return {
        ...state,
        isSaving: action.saveState,
      };
    case actions.loadTeam:
      // Each record is a team
      const { records } = action.records;

      // Retrieved team from cloud; import into local savedTeam
      const iterOrder = [1, 2, 3, 4, 5, 6];

      // Set team name
      const team = {
        "Team Name": records[0]["fields"]["Team Name"],
        members: {},
      };

      console.log(records);
      // iterate through iterOrder and save team-members from cloud to local team
      for (const ix of iterOrder) {
        const slotData = records[0]["fields"][ix];

        // check to see existance of slotdata
        if (slotData) {
          team["members"][ix] = JSON.parse(slotData);
        }
      }
      console.log(records);
      console.log(team);
      return {
        ...state,
        teamTitle: records[0]["fields"]["Team Name"],
        savedTeam: team,
        recordId: records[0]["id"],
      };

    case actions.setCalcdPkmnEv:
      return {
        ...state,
        calcdPkmnEv: {
          name: action.name,
          id: action.id,
          nature: action.finalSpread["nature"],
          message: action.finalSpread["message"],
          evSpread: action.finalSpread["evSpread"],
        },
      };
    // case actions.saveEvSpread:
    //   // Save pre-updated object
    //   state.savedTeamSafeCopy = state.savedTeam;

    //   const availableSlots = [1, 2, 3, 4, 5, 6];
    //   let firstEmptyIx = -1;
    //   for (const savedMemberIx of availableSlots) {
    //     // if no key, there exists empty slot
    //     if (!(savedMemberIx in state.savedTeam["members"])) {
    //       firstEmptyIx = savedMemberIx;
    //       // state.savedTeam["members"][savedMemberIx] = state.calcdPkmnEv;
    //       break;
    //     }
    //   }
    //   // construct object to store new Pokemon
    //   const updatedPkmns = {
    //     ...state,
    //     savedTeam: {
    //       ...state.savedTeam,
    //       members: {
    //         ...state.savedTeam["members"],
    //         [firstEmptyIx]: state.calcdPkmnEv,
    //       },
    //     },
    //   };

    //   return updatedPkmns;
    // case actions.revertSavedTeam:
    //   return {
    //     ...state,
    //     savedTeam: state.savedTeamSafeCopy,
    //   };
    // case actions.deleteEvSpread:
    //   // access to: pkmn
    //   // Save pre-updated object
    //   state.savedTeamSafeCopy = state.savedTeam;

    //   const avail = [1, 2, 3, 4, 5, 6];
    //   let pkmnIx = -1;
    //   for (const savedMemberIx of avail) {
    //     // if pokemon name matches, set index
    //     if (state.savedTeam["members"][savedMemberIx]["name"] === action.pkmn) {
    //       pkmnIx = savedMemberIx;
    //       break;
    //     }
    //   }
    //   // construct object to store new Pokemon
    //   const updatedPkms = {
    //     ...state,
    //     savedTeam: {
    //       ...state.savedTeam,
    //       members: {
    //         ...state.savedTeam["members"],
    //         [pkmnIx]: "",
    //       },
    //     },
    //   };

    //   // Delete pkmnIx
    //   delete updatedPkms["savedTeam"]["members"][pkmnIx];
    //   return updatedPkms;
    case actions.alterSavedTeam:
      // Save pre-updated object
      state.savedTeamSafeCopy = state.savedTeam;

      const availableSlots = [1, 2, 3, 4, 5, 6];
      let updatedPkmns = {};
      for (const chosenMemberIx of availableSlots) {
        // depending on if we are saving or deleting, run a different if statement
        if (action.modifyType === "save") {
          if (!(chosenMemberIx in state.savedTeam["members"])) {
            updatedPkmns = {
              ...state,
              savedTeam: {
                ...state.savedTeam,
                members: {
                  ...state.savedTeam["members"],
                  [chosenMemberIx]: state.calcdPkmnEv,
                },
              },
            };
            return updatedPkmns;
          }
        }
        if (action.modifyType === "delete") {
          if (chosenMemberIx in state.savedTeam["members"]) {
            if (
              state.savedTeam["members"][chosenMemberIx]["name"] === action.pkmn
            ) {
              updatedPkmns = {
                ...state,
                savedTeam: {
                  ...state.savedTeam,
                  members: {
                    ...state.savedTeam["members"],
                    [chosenMemberIx]: "",
                  },
                },
              };
              delete updatedPkmns["savedTeam"]["members"][chosenMemberIx];

              return updatedPkmns;
            }
          }
        }
      }
      // construct object to store new Pokemon
      return updatedPkmns;
    case actions.setTeamTitle:
      console.log("I am here");
      console.log(action.newTitle);
      // set old title to current title before the return
      state.oldTitle = state.teamTitle;
      return {
        ...state,
        teamTitle: action.newTitle,
        savedTeam: { ...state.savedTeam, "Team Title": action.newTitle },
      };
    case actions.revertTitle:
      return {
        ...state,
        teamTitle: state.oldTitle,
        savedTeam: { ...state.savedTeam, "Team Title": state.oldTitle },
      };
  }
  return;
}

export { reducer, actions, initialState };
