import * as React from "react";
import { hot } from "react-hot-loader";

import { Link } from "react-router-dom";
import IsLoggedIn from "components/Auth/IsLoggedIn";
import IsLoggedOut from "components/Auth/IsLoggedOut";

import Routes from "./Routes";
import ContentContainer from "components/Containers/ContentContainer";

function Application(): React.ReactComponentElement<any> {
  return (
    <div className="flex flex-col h-full">
      <header>
        <h1>w8mngr</h1>
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
      </header>
      <main className="flex-grow flex-1 flex-col">
        <Routes />
      </main>
      <footer className="bg-primary text-primaryText mt-13 py-8 min-h-screen flex items-center">
        <ContentContainer>Footer</ContentContainer>
      </footer>
    </div>
  );
}

export default hot(module)(Application);
