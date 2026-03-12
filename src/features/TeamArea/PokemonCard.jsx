import styles from "./PokemonCard.module.css";
import { spreadToExport } from "../../services/spreadToExport";

import ChangeButton from "../../shared/ChangeButton.jsx";

import { useContext } from "react";
import { appContext } from "../../App";

function PokemonCard({ dispPkmn, updateAirTable }) {
  const { pkmnEvState } = useContext(appContext);
  return (
    <div className={styles.cardProps}>
      <h3>{dispPkmn["name"]}</h3>
      <p>{spreadToExport(dispPkmn)}</p>
      {/* <ChangeButton
        buttonName={"Delete"}
        buttonFcn={"delete"}
        pkmn={dispPkmn["name"]}
        updateAirTable={updateAirTable}
      /> */}
    </div>
  );
}

export default PokemonCard;
