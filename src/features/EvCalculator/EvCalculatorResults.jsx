// import function to display evSpread in a presentable manner.
import { spreadToExport } from "../../services/spreadToExport";

// Components
// import SaveSpread from "./../../shared/SaveSpread.jsx";
import ChangeButton from "../../shared/ChangeButton.jsx";

import { useContext, useCallback } from "react";
import { appContext } from "../../App";

// styling
import styles from "./EvCalculatorResults.module.css";

function EvCalculatorResults({ updateAirTable }) {
  // Establish context and pull out calc'd spread
  const { pkmnEvState } = useContext(appContext);

  const textifiedSpread = spreadToExport(pkmnEvState.calcdPkmnEv);

  // Use useCallback to cache the save button, which doesn't change
  const saveBtn = useCallback(() => {
    return (
      <ChangeButton
        buttonName={"Save"}
        buttonFcn={"save"}
        pkmn={"null"}
        updateAirTable={updateAirTable}
      />
    );
  }, [updateAirTable]);
  return (
    <div className={styles.resultsSection}>
      <p>
        Target found! Time to use computeEvSpread for{" "}
        {pkmnEvState.calcdPkmnEv["name"]}
      </p>
      <p>
        <span className={styles.whiteLines}>{textifiedSpread}</span>
      </p>
      <div className={styles.btnStyles}>
        {saveBtn()}
        <ChangeButton
          buttonName={"Delete"}
          buttonFcn={"delete"}
          pkmn={pkmnEvState.calcdPkmnEv["name"]}
          updateAirTable={updateAirTable}
        />
      </div>
    </div>
  );
}

export default EvCalculatorResults;
