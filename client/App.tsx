import * as React from "react";
import { hot } from "react-hot-loader";

import { Link } from "react-router-dom";
import IsLoggedIn from "components/Auth/IsLoggedIn";
import IsLoggedOut from "components/Auth/IsLoggedOut";

import Routes from "./Routes";

function Application(): React.ReactComponentElement<any> {
  return (
    <>
      <h1>w8mngr</h1>
      <hr />
      <Link to="/">Home</Link>
      <IsLoggedIn>
        <>
          &nbsp;|&nbsp;<Link to="/foodlog">Food Log</Link>
          &nbsp;|&nbsp;<Link to="/foods">Foods</Link>
          &nbsp;|&nbsp;<Link to="/logout">Logout</Link>
        </>
      </IsLoggedIn>
      <IsLoggedOut>
        <>
          &nbsp;|&nbsp;<Link to="/register">Register</Link>
          &nbsp;|&nbsp;<Link to="/login">Log In</Link>
        </>
      </IsLoggedOut>
      <hr />
      <Routes />
    </>
  );
}

export default hot(module)(Application);
