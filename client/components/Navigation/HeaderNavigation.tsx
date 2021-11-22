import React from "react";
import { Link } from "react-router-dom";

import { IsLoggedIn } from "../Auth/IsLoggedIn";
import { IsLoggedOut } from "../Auth/IsLoggedOut";
import { FoodCircleIcon } from "../Icons/FoodCircle";
import { HealthCircleIcon } from "../Icons/HealthCircle";
import { LogoutCircleIcon } from "../Icons/LogoutCircleIcon";
import { NavigationIcon } from "./NavigationIcon";
import { Register } from "../Icons/Register";
import { Login } from "../Icons/Login";

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
        <div className="flex-grow" />
        <NavigationIcon
          to="/logout"
          icon={<LogoutCircleIcon />}
          text="Logout"
        />
      </IsLoggedIn>
      <IsLoggedOut>
        <div className="flex-grow" />
        <NavigationIcon to="/register" icon={<Register />} text="Register" />
        <NavigationIcon to="/login" icon={<Login />} text="Login" />
      </IsLoggedOut>
    </div>
  );
}
