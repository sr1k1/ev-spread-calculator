// Use context to access teams
import { useContext, useEffect, useState } from "react";
import { appContext } from "./../../App.jsx";

// Components
import PokemonCard from "./PokemonCard.jsx";
import TeamNameCard from "./TeamNameCard.jsx";

// Area that shows up for saved team

function TeamArea({ updateAirTable, updateTitle }) {
  // Pull out saved teams
  const { dispatch, pkmnEvActions, pkmnEvState } = useContext(appContext);

  // Set state variable to determine if title is being edited
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [title, setTitle] = useState("");

  function handleUpdate(event) {
    // safe case
    if (!isTitleEditing) {
      return;
    }

    event.preventDefault();

    // Update global title
    dispatch({
      type: pkmnEvActions.setTeamTitle,
      newTitle: title,
    });
    return;
  }

  function handleEdit(event) {
    setTitle(event.target.value);
  }
  // For each member in the only team that will be in the above object (for now),
  // create a PokemonCard component.

  // Initially setting title
  useEffect(() => {
    setTitle(pkmnEvState.teamTitle);

    // call function to post result to airtable if we are editing
    if (isTitleEditing) {
      updateTitle();
      console.log(pkmnEvState.teamTitle);
      setIsTitleEditing(false);
    }
  }, [pkmnEvState.teamTitle]);

  return (
    <>
      <h3>Pokemon Saved to Your Team</h3>
      <form onSubmit={handleUpdate}>
        {isTitleEditing ? (
          <>
            <label htmlFor={"setTitle"}>{"Set Title"}</label>
            <input
              type="text"
              id={"setTitle"}
              value={title}
              onChange={handleEdit}
            ></input>
          </>
        ) : (
          <div>
            <h4>
              <span
                onClick={() => {
                  setIsTitleEditing(true);
                }}
              >
                {`Team Name: ${title}`}
              </span>
            </h4>
          </div>
        )}
      </form>
      {pkmnEvState.isLoading ? (
        <p>Loading</p>
      ) : (
        <>
          <h3>{pkmnEvState.savedTeam["Team Name"]}</h3>
          {Object.keys(pkmnEvState.savedTeam["members"]).map((memberId) => {
            const savedMember = pkmnEvState.savedTeam["members"][memberId];
            return (
              <PokemonCard
                key={savedMember["id"]}
                dispPkmn={savedMember}
                updateAirTable={updateAirTable}
              />
            );
          })}
        </>
      )}
    </>
  );
}

export default TeamArea;

{
  /* <ChangeButton
                key={savedMember["id"]}
                buttonName={"Delete"}
                buttonFcn={"delete"}
                pkmn={savedMember["name"]}
              /> */
}
