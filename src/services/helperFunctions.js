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

// ========================= Helper functions to narrow down generation ============================== //
function getPlayFormat(gen, tier, area = "sets") {
  if (area === "sets") {
    return `https://data.pkmn.cc/sets/gen${gen}${tier}.json`;
  }
  if (area === "stats") {
    return `https://data.pkmn.cc/stats/gen${gen}${tier}.json`;
  }
}
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

export {
  fetchData,
  makeOptions,
  formatPkmnName,
  findPkmnInSmogonDb,
  formatMoveName,
  getPlayFormat,
};
