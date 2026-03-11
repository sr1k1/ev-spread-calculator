function spreadToExport(pkmnEvObj) {
  // Converts an object ev spread to a format that can be exported into Pokemon Showdown

  const { hp, atk, def, spa, spd, spe } = pkmnEvObj["evSpread"];
  return `${pkmnEvObj["name"]} \n EVs: ${hp} HP / ${atk} Atk / ${def} Def / ${spa} Spa / ${spd} Spd / ${spe} Spe \n ${pkmnEvObj["nature"]} Nature`;
}

export { spreadToExport };
