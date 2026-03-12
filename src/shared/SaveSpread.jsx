import { useContext, useEffect } from "react";
import { appContext } from "../App";

// import helper functions
import { makeOptions, fetchData } from "../services/helperFunctions";

// Repeated airtable creds, sorry
// Airtable
const urlTeamComp = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TEAM_COMP_TABLE_ID}`;
const token = `Bearer ${import.meta.env.VITE_KEY}`;

function SaveSpread() {
  // access set
  const { dispatch, pkmnEvActions, pkmnEvState } = useContext(appContext);

  async function handleSave(event) {
    event.preventDefault();
    dispatch({ type: pkmnEvActions.saveEvSpread });
  }

  useEffect(() => {
    console.log(pkmnEvState.savedTeam);
    // Update database; create payload and fields first first

    const fields = {};

    for (const pkmnIx of Object.keys(pkmnEvState.savedTeam["members"])) {
      fields[pkmnIx] = JSON.stringify(pkmnEvState.savedTeam["members"][pkmnIx]);
    }
    const payload = {
      records: [
        {
          id: pkmnEvState.recordId,
          fields: fields,
        },
      ],
    };

    const options = makeOptions("PATCH", token, payload);

    // Send request
    async function saveToDb() {
      try {
        dispatch({ type: pkmnEvActions.isSaving, saveState: true });

        const records = await fetchData(urlTeamComp, options);

        // output not needed; we already updated the localdatabase
      } catch (error) {
        dispatch({ type: pkmnEvActions.setLoadError, error });

        // Revert saveState
        dispatch({ type: pkmnEvActions.revertSavedTeam });
      } finally {
        dispatch({ type: pkmnEvActions.isSaving, saveState: false });
      }
    }
    saveToDb();
  }, [pkmnEvState.savedTeam]);

  return (
    <>
      <form onClick={handleSave}>
        <button>Save Pokemon</button>
      </form>
    </>
  );
}

export default SaveSpread;
