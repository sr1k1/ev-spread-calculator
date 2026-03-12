// import function to display evSpread in a presentable manner.
import { spreadToExport } from "../../services/spreadToExport";

// Components
// import SaveSpread from "./../../shared/SaveSpread.jsx";
import ChangeButton from "../../shared/ChangeButton.jsx";

import { useContext } from "react";
import { appContext } from "../../App";

function EvCalculatorResults({ updateAirTable }) {
  // Establish context and pull out calc'd spread
  const { pkmnEvState } = useContext(appContext);

  const textifiedSpread = spreadToExport(pkmnEvState.calcdPkmnEv);

  return (
    <div>
      <p>
        Target found! Time to use computeEvSpread for{" "}
        {pkmnEvState.calcdPkmnEv["name"]}
      </p>
      <p>{textifiedSpread}</p>
      <ChangeButton
        buttonName={"Save"}
        buttonFcn={"save"}
        pkmn={"null"}
        updateAirTable={updateAirTable}
      />
      <ChangeButton
        buttonName={"Delete"}
        buttonFcn={"delete"}
        pkmn={pkmnEvState.calcdPkmnEv["name"]}
        updateAirTable={updateAirTable}
      />
    </div>
  );
}

export default EvCalculatorResults;
