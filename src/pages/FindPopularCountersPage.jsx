import { useState, useContext, useEffect } from "react";
import { appContext } from "../App.jsx";

// Components
import TeamArea from "./../features/TeamArea/TeamArea.jsx";
import PkmnSelector from "../shared/PkmnSelector.jsx";
import GenSelectors from "../shared/GenSelectors.jsx";

// Helper functions
import {
  formatPkmnName,
  fetchData,
  getPlayFormat,
  findPkmnInSmogonDb,
} from "../services/helperFunctions";

// styling
import styles from "./FindPopularCountersPage.module.css";

function FindPopularCountersPage({ updateAirTable, updateTitle }) {
  // Establish generation and tier of Pokemon
  const [gen, setGen] = useState("9");
  const [tier, setTier] = useState("ubers");

  // Create states to save user's preferences
  const [searchPkmn, setSearchPkmn] = useState("");
  const [searchPkmnApi, setSearchPkmnApi] = useState("");
  const [searchPkmnSmogon, setSearchPkmnSmogon] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Create state to save file from which Pokemon will be pulled.
  const [searchGenUrl, setSearchGenUrl] = useState("");
  const [searchDb, setSearchDb] = useState("");

  // Import Pokemon pool to retrieve and fetch endpoints
  const { dispatch, pkmnEvActions, pkmnEvState } = useContext(appContext);
  const urlPokeApi = "https://pokeapi.co/api/v2/pokemon/";

  function handleGens(event) {
    event.preventDefault();
    // Combine gen and tier information using helper function
    const genPath = getPlayFormat(gen, tier, "stats");

    setSearchGenUrl(genPath);
  }

  // useEffect to fetch data and save
  useEffect(() => {
    if (searchGenUrl) {
      fetchData(searchGenUrl).then((pkmnSmogonSets) => {
        setSearchDb(pkmnSmogonSets);
      });
    }
  }, [searchGenUrl]);
  async function handlePkmnChoice(event) {
    event.preventDefault();
    // Pull urls for target Pokemon
    const searchPkmnUrl = `${urlPokeApi}${pkmnEvState.globalPkmnPool[searchPkmn]}`;

    const searchPkmnPokeApiData = await fetchData(searchPkmnUrl);
    setSearchPkmnApi(searchPkmnPokeApiData);

    // Obtain reformatted target Pokemon name to match with Smogon Database
    const searchPkmnSmogon = formatPkmnName(searchPkmn);
    const searchPkmnSmogonData = findPkmnInSmogonDb(
      searchPkmnSmogon,
      searchDb["pokemon"],
    );

    setSearchPkmnSmogon(searchPkmnSmogonData);
    setHasSubmitted(true);
  }

  function findCounters() {
    const counters = Object.keys(searchPkmnSmogon["counters"]);

    if (counters.length === 0) {
      return "No counters to be found in this tier. You can try experimenting with Pokemon from lower tiers. ";
    } else {
      return counters
        .map((counter) => {
          return ` ${counter}`;
        })
        .toString();
    }
  }
  return (
    <>
      <form onSubmit={handleGens}>
        <GenSelectors id={"findCounters"} setGen={setGen} setTier={setTier} />
      </form>
      <form onSubmit={handlePkmnChoice}>
        <PkmnSelector
          selectorId="findPokemon"
          label="Choose a Pokemon you want a counter for: "
          pkmn={searchPkmn}
          setPkmn={setSearchPkmn}
        />{" "}
        <button>Find Counters</button>
      </form>
      {hasSubmitted ? (
        <div className={styles.resultsAgain}>
          <p>The following Pokemon are popular counters to your selection:</p>
          {findCounters()}
        </div>
      ) : (
        <p>
          <></>
        </p>
      )}
      <TeamArea updateAirTable={updateAirTable} updateTitle={updateTitle} />
    </>
  );
}

export default FindPopularCountersPage;
