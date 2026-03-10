import { useContext } from "react";

import { appContext } from "../App";

function PkmnSelector({ selectorId, label, fieldSetter, initialValue }) {
  const { globalPkmnPool } = useContext(appContext);

  // Use the pkmnObj (in this case, the smogon list) to construct a jsx object that sandwiches
  // the Pokemon names into options elements.

  // todo: link smogemon to glokemon to get dex number -> unique id for list
  return (
    <>
      <label htmlFor={selectorId}>{label}</label>
      <input
        id={selectorId}
        list={`${selectorId}List`}
        onChange={(event) => fieldSetter(event.target.value)}
      ></input>
      <datalist id={`${selectorId}List`}>
        {Object.keys(globalPkmnPool).map((pkmnName) => {
          // Map each key of object (Pokemon name) to Pokemon id on website when creating option for
          // dropdown menu
          return <option value={pkmnName} key={globalPkmnPool[pkmnName]} />;
        })}
      </datalist>
    </>
  );
}

export default PkmnSelector;
