import { hot } from "react-hot-loader";
import { Link } from "react-router-dom";
import * as React from "react";
import ContentContainer from "components/Containers/ContentContainer";
import HeartIcon from "components/Icons/Heart";
import IsLoggedIn from "components/Auth/IsLoggedIn";
import IsLoggedOut from "components/Auth/IsLoggedOut";
import Routes from "./Routes";

function Application(): React.ReactComponentElement<any> {
  return (
    <div className="flex flex-col min-h-full">
      <div className="min-h-screen">
        <header className="my-5">
          <h1 className="text-center text-secondary text-5xl">
            <Link to="/" title="w8mngr">
              <HeartIcon />
            </Link>
          </h1>
          <div className="flex justify-around text-xs">
            <Link to="/">Home</Link>
            <IsLoggedIn>
              <Link to="/foodlog">Food Log</Link>
              <Link to="/foods">Foods</Link>
              <Link to="/activities">Activities</Link>
              <Link to="/logout">Logout</Link>
            </IsLoggedIn>
            <IsLoggedOut>
              <Link to="/register">Register</Link>
              <Link to="/login">Log In</Link>
            </IsLoggedOut>
          </div>
        </header>
        <main className="flex-grow flex-1 flex-col">
          <Routes />
        </main>
      </div>
      <footer className="bg-primary text-primaryText mt-13 py-8 min-h-screen flex items-center">
        <ContentContainer>Footer</ContentContainer>
      </footer>
    </div>
  );
}

export default hot(module)(Application);
