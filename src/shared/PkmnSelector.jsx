import { useState, useContext, useEffect } from "react";

import { appContext } from "../App";

function PkmnSelector({ selectorId, label, pkmn, setPkmn }) {
  const { pkmnEvState } = useContext(appContext);

  // Use the pkmnObj (in this case, the smogon list) to construct a jsx object that sandwiches
  // the Pokemon names into options elements.

  // Set plan to debounce; when user inputs data, render an empty list for datalist. Change this
  // when debounce has been successful.

  // const [debouncedPkmn, setDebouncedPkmn] = useState("");
  // const [debouncedDataList, setDebouncedList] = useState([]);

  // Debounce with this; send request to update
  // useEffect(() => {
  //   if (!(pkmn === "")) {
  //     setDebouncedList([]);
  //     console.log("are we in this initial timeout");
  //     const timer = setTimeout(() => {
  //       setDebouncedPkmn(pkmn);
  //     }, 1500);

  //     return () => clearTimeout(timer);
  //   }
  // }, [pkmn, setPkmn]);

  // // Once debounce successful, call another useEffect to populate debouncedDataList
  // useEffect(() => {
  //   if (!(debouncedPkmn === "")) {
  //     // turn off debouncing checker
  //     setDebouncedList(Object.keys(pkmnEvState.globalPkmnPool));
  //   } else {
  //     setDebouncedList([]);
  //   }
  // }, [debouncedPkmn]);

  // detailed list component here for record keeping
  // <datalist id={`${selectorId}List`}>
  //   {debouncedDataList.map((pkmnName) => {
  //     // Map each key of object (Pokemon name) to Pokemon id on website when creating option for
  //     // dropdown menu
  //     return <option value={pkmnName} key={pkmnEvState.globalPkmnPool[pkmnName]} />;
  //   })}
  // </datalist>
  return (
    <>
      <label htmlFor={selectorId}>{label}</label>
      <input
        id={selectorId}
        list={`${selectorId}List`}
        onChange={(event) => {
          setPkmn(event.target.value);
        }}
      ></input>
    </>
  );
}

export default PkmnSelector;
