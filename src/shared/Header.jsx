import { NavLink } from "react-router";

import styles from "./Header.module.css";

function Header({ title }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <nav className={styles.navBar}>
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/counters"}>Counters</NavLink>
        <NavLink to={"/about"}>About</NavLink>
      </nav>
    </>
  );
}

export default Header;
