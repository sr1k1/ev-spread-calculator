function computeEvSpread(
  chosenPkmnApi,
  targetPkmnApi,
  targetPkmnSmogon,
  counterType,
) {
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
      console.log("ho"),
    );
  }

  return;
}

export default computeEvSpread;
