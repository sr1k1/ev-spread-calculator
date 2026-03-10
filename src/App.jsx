import { useReducer, useEffect, createContext } from "react";
import "./App.css";

// Objects related to state management
import {
  reducer as pkmnEvReducer,
  actions as pkmnEvActions,
  initialState as pkmnEvInitialState,
} from "./reducers/pkmnCalc.reducer.js";

// Components
import Header from "./shared/Header.jsx";
import EvCalculatorWrapper from "./features/EvCalculator/EvCalculatorWrapper.jsx";

// Pokemon Endpoints .json file
import { pkmnEndpoints } from "./data/pkmnEndpoints.json";

// Helper functions
import { fetchData, makeOptions } from "./services/helperFunctions.js";

// Delete below import when ready to fetch from server --------------------------------------
import pkmnSmogonSets from "./temp_data/gen9ou.json";

// ------------------------------------------------------------------------------------------

// ---------------- App Context -------------------- //
export const appContext = createContext(null);

function App() {
  const [pkmnEvState, dispatch] = useReducer(pkmnEvReducer, pkmnEvInitialState);

  // Create reference to globalPkmnPool to pass into App Context.
  let globalPkmnPool = pkmnEvState.globalPkmnPool;

  // ======================= Construct all fetch urls and tokens ========================== //

  // Airtable
  const urlTeamComp = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TEAM_COMP_TABLE_ID}`;
  const token = `Bearer ${import.meta.env.VITE_KEY}`;

  // Smogon Pokemon Showdown
  const urlShowdown = "https://data.pkmn.cc/sets/gen9ou.json";

  // ============================== Loading all Pokemon data ============================== //
  useEffect(() => {
    // Smogon data fetch (for popular EV spreads)
    // -------------------------------------------------------------
    // Uncomment below when we are ready to fetch data straight from server
    // fetchData(urlShowdown).then((pkmnSmogonSets) =>
    //   dispatch({ type: pkmnEvActions.setSmogonPkmnPool, pkmnSmogonSets }),
    // );

    // Delete lines below when we are ready to fetch from server
    dispatch({ type: pkmnEvActions.setSmogonPkmnPool, pkmnSmogonSets });
    // ------------------------------------------------------------
    // PokeApi Endpoints for data on every pokemon
    dispatch({ type: pkmnEvActions.setGlobalPkmnPool, pkmnEndpoints });
  }, []);

  return (
    <>
      <appContext.Provider value={{ dispatch, pkmnEvActions, globalPkmnPool }}>
        <div>
          <Header />
          <EvCalculatorWrapper
            smogonPkmnPool={pkmnEvState.smogonPkmnPool}
            isResultCalculated={pkmnEvState.isResultCalculated}
          />
        </div>
      </appContext.Provider>
    </>
  );
}

export default App;
