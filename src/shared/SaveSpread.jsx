import { useContext, useEffect } from "react";
import { appContext } from "../App";

// import helper functions
import { makeOptions, fetchData } from "../services/helperFunctions";
import { UNSAFE_getHydrationData } from "react-router";

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
    // Update database; create payload first
    const payload = {
      records: {
        id: pkmnEvState.recordId,
        fields: JSON.stringify(pkmnEvState.savedTeam["members"]),
      },
    };
    console.log("hi");
    console.log(payload);

    const options = makeOptions("PATCH", token, payload);

    // Send request
    // try {
    //   dispatch({ type: pkmnEvState.isSaving, saveState: true });

    //   const records = await fetchData(urlTeamComp, options);

    //   // output not needed; we already updated the localdatabase
    // } catch (error) {
    //   dispatch({ type: pkmnEvState.setLoadError, error });

    //   // Revert saveState
    //   // dispatch({ type: pkmnEvState.revertSavedTeam });
    // } finally {
    //   dispatch({ type: pkmnEvState.isSaving, saveState: false });
    // }

    // return;
  }, [pkmnEvActions.saveEvSpread]);

  return (
    <>
      <form onClick={handleSave}>
        <button>Save Pokemon</button>
      </form>
    </>
  );
}

export default SaveSpread;
