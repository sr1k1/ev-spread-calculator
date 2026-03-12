import { Link } from "react-router";

function NotFound() {
  return (
    <>
      <p>This page does not exist. </p>
      <Link to="/">Return home.</Link>
    </>
  );
}

export default NotFound;
