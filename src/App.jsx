import { useState, useReducer, useEffect } from "react";
import "./App.css";

// Objects related to state management
import {
  reducer as calcReducer,
  actions as calcActions,
  initialState as calcInitialState,
} from "./reducers/pkmnCalc.reducer.js";

// Components
import Header from "./shared/Header.jsx";

// Pokemon Endpoints .json file
import { pokemonEndpoints } from "./data/pokemonEndpoints.json";

// Helper functions
import { fetchData, makeOptions } from "./services/helperFunctions.js";

// Delete below import when ready to fetch from server
import { pokemon } from "./temp_data/gen9ou.json";

function App() {
  const [calcState, dispatch] = useReducer(calcReducer, calcInitialState);

  // ======================= Construct all fetch urls and tokens ========================== //

  // Airtable
  const urlTeamComp = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TEAM_COMP_TABLE_ID}`;
  const token = `Bearer ${import.meta.env.VITE_KEY}`;

  // Smogon Pokemon Showdown
  const urlShowdown = "https://data.pkmn.cc/stats/gen9ou.json";

  // ========= Data fetch from showdown API for common stat spreads and movesets ========= //

  // Uncomment below when we are ready to fetch data straight from server
  // useEffect(() => {
  //   async function fetchPokemonSetData() {
  //     const response = await fetch(urlShowdown);
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

  // ========= Data fetch from PokeAPI for Pokemon information endpoints =========== //
  useEffect(() => {
    async function fetchPokeApiData() {
      const responseAirtable = await fetchData(
        urlEndpoints,
        makeOptions("GET", token),
      );

      console.log(responseAirtable);
    }
    fetchPokeApiData();
    return;
  }, []);
  // --------------------------------------------------------- //

  console.log(pokemonEndpoints);
  return (
    <>
      <Header />
    </>
  );
}

export default App;
