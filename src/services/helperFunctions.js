// ========================== Fetch-related operations ============================ //

async function fetchData(url, options = null) {
  // If options used, include in fetch.
  let resp = "";
  if (options) {
    resp = await fetch(url, options);
  } else {
    resp = await fetch(url);
  }

  // If response is not okay, raise error
  if (!resp.ok) {
    throw new Error(resp.message);
  }

  // Return retrieved data as parsed json object
  return resp.json();
}

// Creates options parameter for fetching from airtable (e.g. do you want to get data, post it, etc.)
const makeOptions = (methodUsed, token, payload = null) => {
  const options = {
    method: methodUsed,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  // If payload is specified, add it to options
  if (payload) {
    options.body = JSON.stringify(payload);
  }

  // Return options!
  return options;
};

// ======================== Name formatting-related operations ================================
function formatPkmnName(name, useHyphenation = false) {
  let newName = "";

  if (useHyphenation) {
    newName = name.toLowerCase().split(" ").join("-");
  } else {
    // Convert name from hyphenation (pokeapi) to text with spaces (smogon) for Pokemon whose names are more than one.
    const paradoxNameStarters = [
      "Iron",
      "Great",
      "Scream",
      "Slither",
      "Sandy",
      "Roaring",
      "Flutter",
      "Walking",
      "Gouging",
      "Raging",
    ];
    // const formalPrefixesandSuffixes = ["mr", "jr"]; (add support at a later date)
    let newNameArr = name.split("-");

    // Make the first character of each word an uppercase letter
    newNameArr = newNameArr.map((word) => {
      return `${word[0].toUpperCase()}${word.substring(1)}`;
    });

    if (paradoxNameStarters.includes(newNameArr[0])) {
      newNameArr = [
        `${newNameArr[0]} ${newNameArr[1]}`,
        ...newNameArr.slice(2),
      ];
    }
    // reconstruct name from array
    newName = newNameArr.join("-");
  }

  return newName;
}

function findPkmnInSmogonDb(name, smogonDb) {
  if (name in smogonDb) {
    return smogonDb[name];
  } else {
    const firstName = name.split("-")[0];
    if (firstName in smogonDb) {
      return smogonDb[firstName];
    } else {
      return "Pokemon does not exist in database.";
    }
  }
}

function formatMoveName(name) {
  // Just lowercase and hyphenate
  return name.toLowerCase().split(" ").join("-");
}

// ========================== PokeApi Data Parsing Operations ============================ //
function getBaseStats(pokeApiData) {
  const stats = pokeApiData["stats"]; // array with six objects, one per stat

  const pkmnStatOrder = ["hp", "atk", "def", "spa", "spd", "spe"];
  const pkmnStatObj = {};

  for (let ix = 0; ix < pkmnStatOrder.length; ix++) {
    pkmnStatObj[pkmnStatOrder[ix]] = stats[ix]["base_stat"];
  }

  return pkmnStatObj;
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

function getLevelXStats(pkmnBS, pkmnEvs, natureToStatMap, level = 100) {
  function calculateHP() {
    return (
      Math.floor(
        ((2 * pkmnBS["hp"] + 31 + Math.floor(pkmnEvs["hp"] / 4)) * level) / 100,
      ) +
      level +
      10
    );
  }
  function calculateRest(relStat) {
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
  return {
    hp: calculateHP(),
    atk: calculateRest("atk"),
    def: calculateRest("def"),
    spa: calculateRest("spa"),
    spd: calculateRest("spd"),
    spe: calculateRest("spe"),
  };
}
export {
  fetchData,
  makeOptions,
  formatPkmnName,
  findPkmnInSmogonDb,
  formatMoveName,
  getBaseStats,
  getEvSpreads,
  getLevelXStats,
  getMoveDetails,
};
