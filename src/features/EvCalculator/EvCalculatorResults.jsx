// import function to display evSpread in a presentable manner.
import { spreadToExport } from "../../services/spreadToExport";

// Components
import SaveSpread from "./../../shared/SaveSpread.jsx";

import { useContext } from "react";
import { appContext } from "../../App";

function EvCalculatorResults() {
  // Establish context and pull out calc'd spread
  const { dispatch, pkmnEvActions, pkmnEvState } = useContext(appContext);

  const textifiedSpread = spreadToExport(pkmnEvState.calcdPkmnEv);
  const savedTeamDisp = JSON.stringify(pkmnEvState.savedTeam);

  return (
    <div>
      <p>
        Target found! Time to use computeEvSpread for{" "}
        {pkmnEvState.calcdPkmnEv["name"]}
      </p>
      <p>{textifiedSpread}</p>
      <SaveSpread />
    </div>
  );
}

export default EvCalculatorResults;
