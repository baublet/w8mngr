import { Link, BrowserRouter } from "react-router-dom";
import React from "react";

import { ContentContainer } from "./components/Containers/ContentContainer";
import { HeartIcon } from "./components/Icons/Heart";
import { Routes } from "./Routes";
import { FoodCircleIcon } from "./components/Icons/FoodCircle";
import { HealthCircleIcon } from "./components/Icons/HealthCircle";
import { LogoutCircleIcon } from "./components/Icons/LogoutCircleIcon";
import { IsLoggedIn } from "./components/Auth/IsLoggedIn";
import { IsLoggedOut } from "./components/Auth/IsLoggedOut";

interface NavigationIconProps {
  to: string;
  icon: React.ReactComponentElement<any>;
  text: string;
}

function NavigationIcon(props: NavigationIconProps) {
  const { to, icon, text } = props;
  const active = window.location.pathname == to;
  return (
    <Link to={to} className={`block ${active ? "" : "opacity-75"}`}>
      <div className="text-xl block text-center">{icon}</div>
      <span>{text}</span>
    </Link>
  );
}

export function Application(): React.ReactComponentElement<any> {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-full">
        <div className="min-h-screen">
          <header className="my-5">
            <h1 className="text-center text-secondary text-5xl">
              <Link to="/" title="w8mngr">
                <HeartIcon />
              </Link>
            </h1>
            <div className="flex justify-around text-xs">
              <IsLoggedIn>
                <NavigationIcon
                  to="/foodlog"
                  icon={<FoodCircleIcon />}
                  text="Nutrition"
                />
                <NavigationIcon
                  to="/activities"
                  icon={<HealthCircleIcon />}
                  text="Activity"
                />
                <NavigationIcon
                  to="/logout"
                  icon={<LogoutCircleIcon />}
                  text="Logout"
                />
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
    </BrowserRouter>
  );
}
