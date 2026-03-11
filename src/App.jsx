import { useReducer, useEffect, createContext } from "react";
import "./App.css";

// React router components
import { useLocation, Routes, Route } from "react-router";

// Objects related to state management
import {
  reducer as pkmnEvReducer,
  actions as pkmnEvActions,
  initialState as pkmnEvInitialState,
} from "./reducers/pkmnCalc.reducer.js";

// Components
import Header from "./shared/Header.jsx";
import FindPopularCountersPage from "./pages/FindPopularCountersPage.jsx";
import EvCalcPage from "./pages/EvCalcPage.jsx";
import About from "./pages/About.jsx";

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

  // Set App title using location of page
  const userLocation = useLocation();

  useEffect(() => {
    switch (userLocation.pathname) {
      case "/":
        dispatch({
          type: pkmnEvActions.setPageTitle,
          pageTitle: "EV Spread Calculator",
        });
        break;

      case "/counters":
        dispatch({
          type: pkmnEvActions.setPageTitle,
          pageTitle: "Search Common Counters",
        });
      case "/about":
        dispatch({ type: pkmnEvActions.setPageTitle, pageTitle: "About" });
        break;
      default:
        dispatch({ type: pkmnEvActions.setPageTitle, pageTitle: "Not Found" });
    }
  }, [userLocation]);

  // ============================== pkmnEvState elements to make global ===================== //

  // ======================= Construct all fetch urls and tokens ========================== //

  // Airtable
  const urlTeamComp = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TEAM_COMP_TABLE_ID}`;
  const token = `Bearer ${import.meta.env.VITE_KEY}`;

  // Smogon Pokemon Showdown
  const urlShowdown = "https://data.pkmn.cc/sets/gen9ou.json";

  // ============================== Loading all Pokemon data ============================== //
  let records = "";
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

    async function fetchTeams() {
      // Fetch airtable data
      try {
        dispatch({ type: pkmnEvActions.isLoading, loadState: true });
        const options = makeOptions("GET", token);
        records = await fetchData(urlTeamComp, options);

        // Load into reducer to later load into app
        dispatch({ type: pkmnEvActions.loadTeam, records });

        return records;
      } catch (error) {
        dispatch({ type: pkmnEvActions.setLoadError, error });
      } finally {
        dispatch({ type: pkmnEvActions.isLoading, loadState: false });
      }
    }
    fetchTeams();
  }, []);

  return (
    <>
      <appContext.Provider
        value={{
          dispatch,
          pkmnEvActions,
          pkmnEvState,
        }}
      >
        <div>
          <Header title={pkmnEvState.pageTitle} />
          <Routes>
            <Route
              path="/"
              element={
                <EvCalcPage
                  smogonPkmnPool={pkmnEvState.smogonPkmnPool}
                  isResultCalculated={pkmnEvState.isResultCalculated}
                />
              }
            />
            <Route path="/counters" element={<FindPopularCountersPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/*" />
          </Routes>
        </div>
      </appContext.Provider>
    </>
  );
}

export default App;
