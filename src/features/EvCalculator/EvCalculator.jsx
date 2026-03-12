import { useEffect, useState, useContext } from "react";

// Scripts to aid in computation
import computeEvSpread from "../../services/computeEvSpread.js";
import { typeEndpoints } from "../../data/typeEndpoints.json";

// helper functions to aid in computing Evs
import { fetchData, formatMoveName } from "./../../services/helperFunctions.js";

import natureStats from "./../../data/natureStatBuffs.json";

// Import components
import EvCalculatorResults from "./EvCalculatorResults.jsx";

// Import context
import { appContext } from "../../App.jsx";

function EvCalculator({
  chosenPkmn,
  chosenPkmnApi,
  targetPkmnApi,
  targetPkmnSmogon,
  counterType,
  updateAirTable,
}) {
  // Import dispatch to update variables
  const { dispatch, pkmnEvActions, pkmnEvState } = useContext(appContext);

  // Helper Functions for Calculations
  function getBaseStats(pokeApiData) {
    const stats = pokeApiData["stats"]; // array with six objects, one per stat

    const pkmnStatOrder = ["hp", "atk", "def", "spa", "spd", "spe"];
    const pkmnStatObj = {};

    for (let ix = 0; ix < pkmnStatOrder.length; ix++) {
      pkmnStatObj[pkmnStatOrder[ix]] = stats[ix]["base_stat"];
    }

    return pkmnStatObj;
  }

  function getPkmnType(pokeApiData) {
    const types = pokeApiData["types"];

    const pkmnTypeArr = [];
    for (const typeObj of Object.values(types)) {
      pkmnTypeArr.push(typeObj["type"]["name"]);
    }
    return pkmnTypeArr;
  }

  async function getPkmnTypeEffectiveness(pkmnTypes, typeEndpoints) {
    const eachTypeWeaknesses = [];
    const eachTypeStrength = [];

    for (const type of pkmnTypes) {
      const currentTypeWeaknesses = [];
      const currentTypeStrength = [];

      const resp = await fetchData(
        `https://pokeapi.co/api/v2/type/${typeEndpoints[type]}`,
      );

      for (const weakType of resp["damage_relations"]["double_damage_from"]) {
        currentTypeWeaknesses.push(weakType["name"]);
      }

      for (const strongType of resp["damage_relations"]["half_damage_from"]) {
        currentTypeStrength.push(strongType["name"]);
      }
      eachTypeWeaknesses.push(currentTypeWeaknesses);
      eachTypeStrength.push(currentTypeStrength);
    }
    return [eachTypeWeaknesses, eachTypeStrength];
  }

  function getEvSpreads(pkmnSmogon) {
    // Returns array of objects where each object is a popular Ev spread for the Pokemon.
    // Also returns nature, moveset, item, etc. for spread.
    const allSpreads = [];

    for (const eachSpread of Object.values(pkmnSmogon)) {
      // Untangle moveset because this remains unchanged per nature and per spread.
      const moveSet = getMoveset(eachSpread["moves"]);
      const emptyEvs = {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
      };

      // For each nature and each ev spread, create a separate spread. First check
      // if there are multiples of either!
      const natures = eachSpread["nature"];
      const evs = eachSpread["evs"];

      const multipleNature = Array.isArray(natures);
      const multipleEvs = Array.isArray(evs);

      if (multipleNature || multipleEvs) {
        if (multipleEvs && multipleNature) {
          for (const natureElem of natures) {
            for (const evElem of evs) {
              const spread = {
                ...eachSpread,
                nature: natureElem,
                evs: { ...emptyEvs, ...evElem },
                moves: moveSet,
              };

              // Push each spread into array
              allSpreads.push(spread);
            }
          }
        } else if (multipleNature) {
          for (const natureElem of natures) {
            const spread = {
              ...eachSpread,
              nature: natureElem,
              evs: { ...emptyEvs, ...evs },
              moves: moveSet,
            };

            // Push each spread into array
            allSpreads.push(spread);
          }
        } else if (multipleEvs) {
          for (const evElem of evs) {
            const spread = {
              ...eachSpread,
              nature: natures,
              evs: { ...emptyEvs, ...evElem },
              moves: moveSet,
            };

            // Push each spread into array
            allSpreads.push(spread);
          }
        }
      } else {
        const spread = {
          ...eachSpread,
          nature: natures,
          evs: { ...emptyEvs, ...evs },
          moves: moveSet,
        };

        allSpreads.push(spread);
      }
    }
    return allSpreads;
  }

  function getMoveset(pkmnMoveset) {
    // Base cases: if list of length 1 and:
    //  element inside is string, call formatMoveName on string
    //  element inside is array, call function recursively.
    if (pkmnMoveset.length === 1) {
      if (typeof pkmnMoveset[0] === "string") {
        return [formatMoveName(pkmnMoveset[0])];
      }

      if (Array.isArray(pkmnMoveset[0])) {
        return getMoveset(pkmnMoveset[0]);
      }
    }
    // Recursive step: we still have a list of moves
    return getMoveset(pkmnMoveset.slice(0, 1)).concat(
      getMoveset(pkmnMoveset.slice(1)),
    );
  }

  async function getMoveDetails(pkmnMove) {
    // returns object with type of move, power, special/physical.
    const pokeMoveUrl = `https://pokeapi.co/api/v2/move/${pkmnMove}`;

    const response = await fetchData(pokeMoveUrl);
    return {
      type: response["type"]["name"],
      power: response["power"],
      class: response["damage_class"]["name"],
    };
  }

  // =========== use useCallback to store these calc-heavy functions ===== //
  function calcHP(pkmnBS, pkmnEvs, level = 100) {
    return (
      Math.floor(
        ((2 * pkmnBS["hp"] + 31 + Math.floor(pkmnEvs["hp"] / 4)) * level) / 100,
      ) +
      level +
      10
    );
  }
  function calcOtherStats(
    relStat,
    pkmnBS,
    pkmnEvs,
    natureToStatMap,
    level = 100,
  ) {
    return Math.floor(
      (Math.floor(
        ((2 * pkmnBS[relStat] + 31 + Math.floor(pkmnEvs[relStat] / 4)) *
          level) /
          100,
      ) +
        5) *
        natureToStatMap[relStat],
    );
  }

  function getLevelXStats(pkmnBS, pkmnEvs, natureToStatMap, level = 100) {
    return {
      hp: calcHP(pkmnBS, pkmnEvs, natureToStatMap, (level = 100)),
      atk: calcOtherStats(
        "atk",
        pkmnBS,
        pkmnEvs,
        natureToStatMap,
        (level = 100),
      ),
      def: calcOtherStats(
        "def",
        pkmnBS,
        pkmnEvs,
        natureToStatMap,
        (level = 100),
      ),
      spa: calcOtherStats(
        "spa",
        pkmnBS,
        pkmnEvs,
        natureToStatMap,
        (level = 100),
      ),
      spd: calcOtherStats(
        "spd",
        pkmnBS,
        pkmnEvs,
        natureToStatMap,
        (level = 100),
      ),
      spe: calcOtherStats(
        "spe",
        pkmnBS,
        pkmnEvs,
        natureToStatMap,
        (level = 100),
      ),
    };
  }

  // ================== cached ======================= //

  function calcDmgDealt(
    targetPkmnStats,
    chosenPkmnStats,
    movePower,
    type1Effectiveness,
    type2Effectiveness,
    stab,
    level = 100,
  ) {
    // Placeholders
    const targetPkmnAtk = targetPkmnStats["atk"];
    const chosenPkmnDef = chosenPkmnStats["def"];

    return (
      ((((2 * level) / 5 + 2) * movePower * targetPkmnAtk) /
        chosenPkmnDef /
        50 +
        2) *
      stab *
      type1Effectiveness *
      type2Effectiveness
    );
    console.log(dmgTaken / targetPkmnStats["hp"]);
  }
  function calcEvstoStat(
    desiredStatValue,
    stat,
    nature,
    pkmnBS,
    natureToStatMap,
    level = 100,
  ) {
    const rawEvs = Math.ceil(
      (((desiredStatValue / natureToStatMap[nature][stat] - 5) * 100) / level -
        (2 * pkmnBS[stat] + 31)) *
        4,
    );
    // Evs affect stats for every four points
    return Math.ceil(rawEvs / 4) * 4;
  }

  function calcDefToDmg(dmg, attack, power, stab, type1, type2, level = 100) {
    return (
      attack /
      ((50 * (dmg / (stab * type1 * type2) - 2)) /
        (power * ((2 * level) / 5 + 2)))
    );
  }

  function calcOffensiveSpread(
    targetPkmnStats,
    chosenPkmnBS,
    move,
    type1Effectiveness,
    type2Effectiveness,
    stab,
    calcDmgDealt,
    currentEvSpread,
  ) {
    // Set chosen Pokemon nature
    let chosenNature = "";
    let atkStat = "";
    if (chosenPkmnBS["atk"] > chosenPkmnBS["spa"]) {
      chosenNature = "Jolly"; // +speed, - special attack
      atkStat = "atk";
    } else {
      chosenNature = "Timid"; // +speed, - attack
      atkStat = "spa";
    }

    // Final spread
    const finalSpread = {
      nature: chosenNature,
      message: "",
      evSpread: {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
      },
    };

    let totalEvs = 510;

    // HP
    const hpEvs = 252;
    finalSpread["evSpread"]["hp"] = 252;
    totalEvs -= hpEvs;

    // Calculate evs needed to outspeed; if cannot outspeed, ignore and focus on defenses.
    const targetPkmnSpeed = targetPkmnStats["spe"];
    let speEvs = calcEvstoStat(
      targetPkmnSpeed + 2,
      "spe",
      chosenNature,
      chosenPkmnBS,
      natureStats,
    );

    if (speEvs < totalEvs) {
      // Make sure that the Pokemon isn't faster by default
      if (speEvs < 0) {
        speEvs = 0;
      }

      finalSpread["evSpread"]["spe"] = speEvs;
      totalEvs -= speEvs;
    }
    // Calculate amount of Evs in appropriate defense stat to allow surviving one hit
    // Determine if def or spd
    let defStat = "";
    let otherDefStat = "";
    if (move["class"] === "physical") {
      defStat = "def";
      otherDefStat = "spd";
    } else {
      defStat = "spd";
      otherDefStat = "def";
    }

    const dmgChosenPkmnTakes = calcHP(chosenPkmnBS, finalSpread["evSpread"]);
    const defToSurvive = calcDefToDmg(
      dmgChosenPkmnTakes - 1,
      targetPkmnStats["atk"],
      move["power"],
      stab,
      type1Effectiveness,
      type2Effectiveness,
    );

    let evsToDef = calcEvstoStat(
      defToSurvive,
      defStat,
      chosenNature,
      chosenPkmnBS,
      natureStats,
    );

    if (evsToDef < totalEvs) {
      // Make sure that the Pokemon isn't faster by default
      if (evsToDef < 0) {
        evsToDef = 0;
      }
      finalSpread["evSpread"][defStat] = evsToDef;
      totalEvs -= evsToDef;
      finalSpread.message = "Success!";
    } else {
      finalSpread["message"] =
        "This Pokemon cannot survive an attack from the opponent.";
    }

    // Put the rest of the evs in the Pokemon's highest stats.
    const allotableStats = Math.min(totalEvs, 252);
    totalEvs -= allotableStats;

    finalSpread["evSpread"][atkStat] = allotableStats;
    finalSpread["evSpread"][otherDefStat] = totalEvs;

    // if defense stat is higher in spread, return that spread.
    if (
      finalSpread["evSpread"]["hp"] > currentEvSpread["evSpread"]["hp"] ||
      finalSpread["evSpread"][defStat] > currentEvSpread["evSpread"][defStat]
    ) {
      return finalSpread;
    } else {
      return currentEvSpread;
    }
  }

  function calcDefensiveSpread(
    targetPkmnStats,
    chosenPkmnStats,
    move,
    type1Effectiveness,
    type2Effectiveness,
    stab,
    calcDmgDealt,
    currentEvSpread,
  ) {
    return;
  }
  // ----------------------------------------------------------------------------------- //
  // ----------------------------------------------------------------------------------- //

  // const [finalEvSpread, setFinalEvSpread] = useState("");
  let finalEvSpread = "";
  useEffect(() => {
    // If Smogon set cannot be found, do not run this useEffect
    if (typeof targetPkmnSmogon === "string") {
      return;
    }
    async function performCalc() {
      // All Pokemon stats will be stored in objects where the keys are 'hp', 'atk', 'def', 'spa', 'spd', 'spe'.
      // From the above, we are only interested in base stats from PkmnApi.
      const chosenPkmnBS = getBaseStats(chosenPkmnApi);
      const targetPkmnBS = getBaseStats(targetPkmnApi);

      // Find types of both pokemon
      const chosenPkmnTypes = getPkmnType(chosenPkmnApi);
      const targetPkmnTypes = getPkmnType(targetPkmnApi);

      // Save Ev spread best suited to take all popular sets of a Pokemon
      let bestChosenEvSpread = {
        nature: "",
        message: "",
        evSpread: {
          hp: 0,
          atk: 0,
          def: 0,
          spa: 0,
          spd: 0,
          spe: 0,
        },
      };

      for (const targetEvSpread of getEvSpreads(targetPkmnSmogon)) {
        const targetPkmnStats = getLevelXStats(
          targetPkmnBS,
          targetEvSpread["evs"],
          natureStats[targetEvSpread["nature"]],
        );

        // iterate over each move in the selected spread
        for (const move of targetEvSpread["moves"]) {
          // For each move, pull out details about move power and move type.
          // Compare move to target Pokemon's type and power, and compute resulting damage.
          // Compare to chosen Pokemon HP and round down to nearest three hit KO or two hit KO (round down)
          // with appropriate + nature (based on defensive vs. offensive counter)

          const attackDetails = await getMoveDetails(move);

          // If the move is a status move, we cannot calculate any damage values. Continue to
          // next loop
          if (attackDetails["class"] === "status") {
            continue;
          }

          // Attacker details
          let stab = 1; // same type attack bonus
          if (targetPkmnTypes.includes(attackDetails["type"])) {
            stab = 1.5;
          }

          // Defender details
          let type1Effectiveness = 1;
          let type2Effectiveness = 1;

          const [defenderWeaknesses, defenderStrength] =
            await getPkmnTypeEffectiveness(chosenPkmnTypes, typeEndpoints);

          // Type 1
          if (defenderWeaknesses[0].includes(attackDetails["type"])) {
            type1Effectiveness = 2;
          }
          if (defenderStrength[0].includes(attackDetails["type"])) {
            type1Effectiveness = 0.5;
          }

          // Type 2 if it exists
          if (defenderWeaknesses.length === 2) {
            if (defenderWeaknesses[1].includes(attackDetails["type"])) {
              type2Effectiveness = 2;
            }
            if (defenderStrength[1].includes(attackDetails["type"])) {
              type2Effectiveness = 0.5;
            }
          }

          // We have everything we need to calc damage now!! Depending on type of counter
          // desired, call function to compute spread.
          if (counterType === "offensive") {
            bestChosenEvSpread = calcOffensiveSpread(
              targetPkmnStats,
              chosenPkmnBS,
              attackDetails,
              type1Effectiveness,
              type2Effectiveness,
              stab,
              calcDmgDealt,
              bestChosenEvSpread,
            );
          } else {
            bestChosenEvSpread = calcDefensiveSpread(
              targetPkmnStats,
              chosenPkmnBS,
              attackDetails,
              type1Effectiveness,
              type2Effectiveness,
              stab,
              calcDmgDealt,
              bestChosenEvSpread,
            );
          }
        }
      }
      dispatch({
        type: pkmnEvActions.setCalcdPkmnEv,
        name: chosenPkmn,
        id: pkmnEvState.globalPkmnPool[chosenPkmn],
        finalSpread: bestChosenEvSpread,
      });
      return;
    }

    performCalc();
  }, [chosenPkmnApi, targetPkmnApi]);

  return typeof targetPkmnSmogon === "string" ? (
    <p>The target Pokemon cannot be found</p>
  ) : (
    <EvCalculatorResults updateAirTable={updateAirTable} />
  );
}

export default EvCalculator;
