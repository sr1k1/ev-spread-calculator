async function createPkmnEndpoints() {
  const urlPokeApi = "https://pokeapi.co/api/v2/pokemon/?limit=1500000";
  const resp = await fetch(urlPokeApi);

  // If results not okay, throw an error
  if (!resp.ok) {
    throw new Error(resp.message);
  }

  const { results } = await resp.json();

  // Go through data and construct object that maps pokemon name string to id
  const pkmnIdMapping = {};
  for (pkmn of results) {
    // For each pokemon, a url is stored with the id embedded inside.
    // Split url and take the second to last element
    const splitUrl = pkmn.url.split("/");
    const idIx = splitUrl.length - 2;

    pkmnIdMapping[pkmn.name] = splitUrl[idIx];
  }

  console.log(pkmnIdMapping);

  return;
}

export default createPkmnEndpoints;
