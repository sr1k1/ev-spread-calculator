import { useReducer, useEffect, useState, createContext } from "react";
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
        break;
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
  const [urlShowdown, setUrlShowdown] = useState(
    "https://data.pkmn.cc/sets/gen9ou.json",
  );

  // ============================= Fetch-related functions ================================ //

  async function updateAirTable() {
    // Update database; create payload and fields first
    const fields = {};

    // Stringify the data inside each key's associated object. For those that have nothing, set
    // that value to null
    const iterIx = [1, 2, 3, 4, 5, 6];
    for (const pkmnIx of iterIx) {
      if (!(pkmnIx in pkmnEvState.savedTeam["members"])) {
        fields[pkmnIx] = null;
        continue;
      }
      fields[pkmnIx] = JSON.stringify(pkmnEvState.savedTeam["members"][pkmnIx]);
    }

    // for (const pkmnIx of Object.keys(pkmnEvState.savedTeam["members"])) {
    //   fields[pkmnIx] = JSON.stringify(pkmnEvState.savedTeam["members"][pkmnIx]);
    // }
    const payload = {
      records: [
        {
          id: pkmnEvState.recordId,
          fields: fields,
        },
      ],
    };

    const options = makeOptions("PATCH", token, payload);

    console.log("-----begin button-----");
    console.log(options);
    console.log(urlTeamComp);
    console.log(token);

    // Send request
    try {
      dispatch({ type: pkmnEvActions.isSaving, saveState: true });

      const records = await fetchData(urlTeamComp, options);

      // output not needed; we already updated the localdatabase
    } catch (error) {
      dispatch({ type: pkmnEvActions.setLoadError, error });

      // Revert saveState
      dispatch({ type: pkmnEvActions.revertSavedTeam }); //change
    } finally {
      dispatch({ type: pkmnEvActions.isSaving, saveState: false });
    }
    return;
  }

  async function updateTitle(newTitle) {
    // Just want to update title, so reflect that in payload
    const payload = {
      records: [
        {
          id: pkmnEvState.recordId,
          fields: { "Team Title": newTitle },
        },
      ],
    };
    const options = makeOptions("PATCH", token, payload);

    console.log(options);
    try {
      dispatch({ type: pkmnEvActions.isSaving, saveState: true });

      const records = await fetchData(urlTeamComp, options);

      // output not needed; we already updated the localdatabase
    } catch (error) {
      dispatch({ type: pkmnEvActions.setLoadError, error });

      // Revert saveState
      dispatch({ type: pkmnEvActions.revertTitle });
    } finally {
      dispatch({ type: pkmnEvActions.isSaving, saveState: false });
    }

    return;
  }

  // ============================== Loading all Pokemon data ============================== //
  // use a useEffect() to update smogon database whenever the url is changed
  useEffect(() => {
    // Smogon data fetch (for popular EV spreads)
    fetchData(urlShowdown).then((pkmnSmogonSets) =>
      dispatch({ type: pkmnEvActions.setSmogonPkmnPool, pkmnSmogonSets }),
    );
  }, [urlShowdown]);

  let records = "";
  useEffect(() => {
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
                  updateAirTable={updateAirTable}
                  updateTitle={updateTitle}
                  setUrlShowdown={setUrlShowdown}
                />
              }
            />
            <Route
              path="/counters"
              element={
                <FindPopularCountersPage
                  updateAirTable={updateAirTable}
                  updateTitle={updateTitle}
                  setUrlShowdown={setUrlShowdown}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/*" />
          </Routes>
        </div>
      </appContext.Provider>
    </>
  );
}

export default App;
