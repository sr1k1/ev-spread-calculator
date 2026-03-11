import styles from "./PokemonCard.module.css";
import { spreadToExport } from "../../services/spreadToExport";

function PokemonCard({ pkmn }) {
  return (
    <div className={styles.showLineBreak}>
      <h3>{pkmn["name"]}</h3>
      <p>{spreadToExport(pkmn)}</p>
    </div>
  );
}

export default PokemonCard;
