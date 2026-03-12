import { NavLink } from "react-router";

function Header({ title }) {
  return (
    <>
      <h1>{title}</h1>
      <nav>
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/counters"}>Counters</NavLink>
        <NavLink to={"/about"}>About</NavLink>
      </nav>
    </>
  );
}

export default Header;
