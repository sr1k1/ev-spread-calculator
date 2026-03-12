import TeamArea from "../features/TeamArea/TeamArea";

// style
import styles from "./About.module.css";

function About({ updateAirTable, updateTitle }) {
  return (
    <>
      <div className={styles.explStyle}>
        <p>
          This app is designed to work with competitive Pokemon. In competitive
          Pokemon, you are tasked with creating a team of six Pokemon and are
          responsible for using a limited number of stat points to buff the
          stats you think will be helpful. This tool lets you auto-compute that
          for any Pokemon of your choice to ensure that the Pokemon will at
          least survive one hit from any Pokemon of your choosing.
        </p>
        <p>
          This app was created by Smah Riki as the final project for Code the
          Dream's Lark class.
        </p>
      </div>
      <TeamArea updateAirTable={updateAirTable} updateTitle={updateTitle} />
    </>
  );
}

export default About;
