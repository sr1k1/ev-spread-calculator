// Scripts to aid in computation
import computeEvSpread from "../../services/computeEvSpread.js";

// helper functions to aid in computing Evs
import {
  getBaseStats,
  getEvSpreads,
  getLevelXStats,
  getMoveDetails,
} from "./../../services/helperFunctions.js";

import natureStats from "./../../data/natureStatBuffs.json";

function EvCalculator({
  chosenPkmnApi,
  targetPkmnApi,
  targetPkmnSmogon,
  counterType,
}) {
  async function handleEvSpread() {
    // All Pokemon stats will be stored in objects where the keys are 'hp', 'atk', 'def', 'spa', 'spd', 'spe'.
    // From the above, we are only interested in base stats from PkmnApi.
    const chosenPkmnBS = getBaseStats(chosenPkmnApi);
    const targetPkmnBS = getBaseStats(targetPkmnApi);

    // Save Ev spread best suited to take all popular sets of a Pokemon
    const bestChosenEvSpread = {
      hp: 0,
      atk: 0,
      def: 0,
      spa: 0,
      spd: 0,
      spe: 0,
    };

    for (const targetEvSpread of getEvSpreads(targetPkmnSmogon)) {
      const targetPkmnStats = getLevelXStats(
        targetPkmnBS,
        targetEvSpread["evs"],
        natureStats[targetEvSpread["nature"]],
      );
      console.log("hi");
      console.log(targetEvSpread);
      break;
    }
  }
  // Results displayed on app from here
  return typeof targetPkmnSmogon === "string" ? (
    <p>The target Pokemon cannot be found</p>
  ) : (
    <div>
      <p>Target found! Time to use computeEvSpread</p>
      {handleEvSpread()}
    </div>
  );
}

export default EvCalculator;
