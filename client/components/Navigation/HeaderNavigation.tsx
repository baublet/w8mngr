import React from "react";
import { Link } from "react-router-dom";

import { IsLoggedIn } from "../Auth/IsLoggedIn";
import { IsLoggedOut } from "../Auth/IsLoggedOut";
import { FoodCircleIcon } from "../Icons/FoodCircle";
import { HealthCircleIcon } from "../Icons/HealthCircle";
import { LogoutCircleIcon } from "../Icons/LogoutCircleIcon";
import { NavigationIcon } from "./NavigationIcon";

export function HeaderNavigation() {
  return (
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
  );
}
