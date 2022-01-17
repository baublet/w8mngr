import React from "react";
import { Route, Switch } from "react-router-dom";

import { useVerifyEmail } from "./helpers";

import { Home } from "./pages/Home";
import { Logout } from "./pages/Logout";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Nutrition } from "./pages/Nutrition";
import { FoodLog } from "./pages/FoodLog";
import { Foods } from "./pages/Foods";
import { NewFood } from "./pages/NewFood";
import { EditFood } from "./pages/EditFood";
import { Activities } from "./pages/Activities";
import { NewActivity } from "./pages/NewActivity";
import { Activity } from "./pages/Activity";
import { EditActivity } from "./pages/EditActivity";
import { ActivityLog } from "./pages/ActivityLog";
import { WeightLog } from "./pages/WeightLog";
import { ForgotPassword } from "./pages/ForgotPassword";

const routes = [
  { key: "home", path: "/", name: "Home", Component: Home },
  { key: "login", path: "/login", Component: Login },
  { key: "logout", path: "/logout", Component: Logout },
  { key: "nutrition", path: "/nutrition", Component: Nutrition },
  { key: "register", path: "/register", Component: Register },
  { key: "foodlog", path: ["/foodlog", "/foodlog/:day"], Component: FoodLog },
  { key: "foods", path: "/foods", Component: Foods },
  { key: "new-food", path: "/foods/new", Component: NewFood },
  { key: "edit-food", path: "/foods/edit/:id", Component: EditFood },
  { key: "activities", path: "/activities", Component: Activities },
  { key: "new-activity", path: "/activities/new", Component: NewActivity },
  { key: "edit-act", path: "/activities/edit/:id", Component: EditActivity },
  {
    key: "activity-log",
    path: ["/activities/:id/log", "/activities/:id/log/:day"],
    Component: ActivityLog,
  },
  { key: "activity-details", path: "/activities/:id", Component: Activity },
  {
    key: "weight-log",
    path: ["/weightlog", "/weightlog/:day"],
    Component: WeightLog,
  },
  {
    key: "forgot-password",
    path: ["/forgot-password"],
    Component: ForgotPassword,
  },
];

export function Routes() {
  useVerifyEmail();
  return (
    <div className="relative">
      <Switch>
        {routes.map(({ key, path, Component }) => (
          <Route key={key} path={path} exact>
            <div className="toast">
              <Component />
            </div>
          </Route>
        ))}
      </Switch>
    </div>
  );
}
