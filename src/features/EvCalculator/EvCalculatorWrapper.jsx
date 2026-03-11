// React hooks
import { useState, useContext, useEffect } from "react";

// Children components
import PkmnSelector from "../../shared/PkmnSelector.jsx";
import EvCalculator from "./EvCalculator.jsx";

// Helper functions
import {
  fetchData,
  formatPkmnName,
  findPkmnInSmogonDb,
  formatMoveName,
} from "../../services/helperFunctions.js";

// Import context from app.jsx
import { appContext } from "../../App.jsx";

function EvCalculatorWrapper({ smogonPkmnPool, isResultCalculated }) {
  // Import Pokemon pool to retrieve and fetch endpoints
  const { dispatch, pkmnEvActions, globalPkmnPool } = useContext(appContext);
  const urlPokeApi = "https://pokeapi.co/api/v2/pokemon/";

  // States to track user input
  const [chosenPkmn, setChosenPkmn] = useState("");
  const [targetPkmn, setTargetPkmn] = useState("");
  const [counterType, setCounterType] = useState("offensive");

  // States to track processed data from submitting form
  const [chosenPkmnApi, setChosenPkmnApi] = useState("");
  const [targetPkmnApi, setTargetPkmnApi] = useState("");
  const [targetPkmnSmogon, setTargetPkmnSmogon] = useState("");

  async function handleEvComputation(event) {
    event.preventDefault();

    // Pull urls for both Pokemon and fetch their data.
    const chosenPkmnUrl = `${urlPokeApi}${globalPkmnPool[chosenPkmn]}`;
    const targetPkmnUrl = `${urlPokeApi}${globalPkmnPool[targetPkmn]}`;

    // Fetch data for both
    const chosenPkmnPokeApiData = await fetchData(chosenPkmnUrl);
    const targetPkmnPokeApiData = await fetchData(targetPkmnUrl);

    setChosenPkmnApi(chosenPkmnPokeApiData);
    setTargetPkmnApi(targetPkmnPokeApiData);

    // Obtain reformatted target Pokemon name to match with Smogon Database
    const targetPkmnSmogon = formatPkmnName(targetPkmn);
    const targetPkmnSmogonData = findPkmnInSmogonDb(
      targetPkmnSmogon,
      smogonPkmnPool,
    );

    setTargetPkmnSmogon(targetPkmnSmogonData);

    // Pass all parameters into ResultsEvCalculator, which will call computeEvSpread and determine
    // what results to be displayed.

    // Results are in the process of being calculated, so dispatch to change state that will display
    // results
    dispatch({ type: pkmnEvActions.calculateResult });
    return;
  }

  // -----------------------------------------------------

  return (
    <>
      <form onSubmit={handleEvComputation}>
        <PkmnSelector
          selectorId="yourPokemon"
          label="Choose your Pokemon: "
          pkmn={chosenPkmn}
          setPkmn={setChosenPkmn}
        />{" "}
        <br />
        <PkmnSelector
          selectorId="targetPokemon"
          label="Target Pokemon to counter/check: "
          pkmn={targetPkmn}
          setPkmn={setTargetPkmn}
        />{" "}
        <br />
        <label htmlFor={"typeOfCounter"}></label>
        <select
          id={"typeOfCounter"}
          onChange={(event) => {
            setCounterType(event.target.value);
          }}
        >
          <option value="offensive">Offensive</option>
          <option value="defensive">Defensive</option>
        </select>
        <br />
        <button>Compute Ev Spread</button>
      </form>
      {isResultCalculated ? (
        <EvCalculator
          chosenPkmnApi={chosenPkmnApi}
          targetPkmnApi={targetPkmnApi}
          targetPkmnSmogon={targetPkmnSmogon}
          counterType={counterType}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default EvCalculatorWrapper;
