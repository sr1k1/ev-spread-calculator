import { useState, useReducer, useEffect } from "react";
import "./App.css";

// Import objects related to state management
import {
  reducer as calcReducer,
  actions as calcActions,
  initialState as calcInitialState,
} from "./reducers/pkmnCalc.reducer.js";

// Delete below import when ready to fetch from server
import { pokemon } from "./temp_data/gen9ou.json";

function App() {
  // Data fetch from showdown API
  const [calcState, dispatch] = useReducer(calcReducer, calcInitialState);

  // Uncomment below when we are ready to fetch data straight from server
  // useEffect(() => {
  //   async function fetchPokemonSetData() {
  //     const response = await fetch("https://data.pkmn.cc/stats/gen9ou.json");
  //     const { pokemon } = await response.json();
  //     dispatch({ type: calcActions.setPkmnPool, pokemon });

  //     return;
  //   }
  //   fetchPokemonSetData();
  // }, []);

  // Delete lines below when we are ready to fetch from server
  useEffect(() => {
    dispatch({ type: calcActions.setPkmnPool, pokemon });
  }, []);

  // --------------------------------------------------------- //

  return <></>;
}

export default App;
