import styles from "./GenSelectors.module.css";

function GenSelectors({ id, setGen, setTier }) {
  return (
    <div className={styles.genTierOrientation}>
      <div className={styles.boxSep}>
        <label className={styles.labelSize} htmlFor={`${id}gen`}>
          Generation:
        </label>
        <select
          id={`${id}gen`}
          onChange={(event) => {
            setGen(event.target.value);
          }}
        >
          <option value={9}>9</option>
          <option value={8}>8</option>
        </select>
      </div>
      <div className={styles.boxSep}>
        <label className={styles.labelSize} htmlFor={`${id}tier`}>
          Tier:
        </label>
        <select
          id={`${id}tier`}
          onChange={(event) => {
            setTier(event.target.value);
          }}
        >
          <option value={"ubers"}>ubers</option>
          <option value={"ou"}>ou</option>
          <option value={"uu"}>uu</option>
          <option value={"ru"}>ru</option>
          <option value={"pu"}>pu</option>
        </select>
        <button>Set Generation and Tier</button>
      </div>
    </div>
  );
}

export default GenSelectors;
