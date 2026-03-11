// Use context to access teams
import { useContext } from "react";
import { appContext } from "./../../App.jsx";

// Components
import PokemonCard from "./PokemonCard.jsx";
import TeamNameCard from "./TeamNameCard.jsx";

// Area that shows up for saved team

function TeamArea() {
  // Pull out saved teams
  const { dispatch, pkmnEvActions, pkmnEvState } = useContext(appContext);

  // For each member in the only team that will be in the above object (for now),
  // create a PokemonCard component.

  return (
    <>
      <h3>Pokemon Saved to Your Team</h3>
      {pkmnEvState.isLoading ? (
        <p>Loading</p>
      ) : (
        Object.keys(pkmnEvState.savedTeam["members"]).map((memberId) => {
          const savedMember = pkmnEvState.savedTeam["members"][memberId];
          return <PokemonCard key={savedMember["id"]} pkmn={savedMember} />;
        })
      )}
    </>
  );
}

export default TeamArea;
