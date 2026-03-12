import { useContext, useEffect } from "react";
import { appContext } from "../App";

function ChangeButton({ buttonName, buttonFcn, pkmn, updateAirTable }) {
  // access set
  const { dispatch, pkmnEvActions, pkmnEvState } = useContext(appContext);

  async function handleChange(event) {
    event.preventDefault();
    if (buttonFcn === "save") {
      dispatch({
        type: pkmnEvActions.alterSavedTeam,
        modifyType: "save",
        pkmn,
      });
    } else if (buttonFcn === "delete") {
      dispatch({
        type: pkmnEvActions.alterSavedTeam,
        modifyType: "delete",
        pkmn,
      });
    }
  }

  useEffect(() => {
    console.log(pkmnEvState.savedTeam);
    updateAirTable();
  }, [pkmnEvState.savedTeam]);

  return (
    <>
      <form onClick={handleChange}>
        <button>{buttonName}</button>
      </form>
    </>
  );
}

export default ChangeButton;
