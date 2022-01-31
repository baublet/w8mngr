import React from "react";
import { Link } from "react-router-dom";

import { IsLoggedIn } from "../Auth/IsLoggedIn";
import { IsLoggedOut } from "../Auth/IsLoggedOut";
import { FoodCircleIcon } from "../Icons/FoodCircle";
import { HealthCircleIcon } from "../Icons/HealthCircle";
import { LoginIcon } from "../Icons/Login";
import { LogoutCircleIcon } from "../Icons/LogoutCircleIcon";
import { RegisterIcon } from "../Icons/Register";
import { NavigationIcon } from "./NavigationIcon";

export function HeaderNavigation() {
  return (
    <div className="flex justify-around text-xs w-full">
      <IsLoggedIn>
        <NavigationIcon
          to="/nutrition"
          icon={<FoodCircleIcon />}
          text="Nutrition"
        />
        <NavigationIcon
          to="/activities"
          icon={<HealthCircleIcon />}
          text="Activity"
        />
                <NavigationIcon
          to="/weightlog"
          icon={<HealthCircleIcon />}
          text="Weight"
        />
        <div className="flex-grow" />
        <NavigationIcon
          to="/logout"
          icon={<LogoutCircleIcon />}
          text="Logout"
        />
      </IsLoggedIn>
      <IsLoggedOut>
        <div className="flex-grow" />
        <NavigationIcon to="/register" icon={<RegisterIcon />} text="Register" />
        <NavigationIcon to="/login" icon={<LoginIcon />} text="Login" />
      </IsLoggedOut>
    </div>
  );
}
