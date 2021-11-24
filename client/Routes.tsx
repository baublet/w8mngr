import React from "react";
import { Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { Home } from "./pages/Home";
import { Logout } from "./pages/Logout";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Nutrition } from "./pages/Nutrition";
import { FoodLog } from "./pages/FoodLog";
import { Foods } from "./pages/Foods";

const routes = [
  { key: "home", path: "/", name: "Home", Component: Home },
  { key: "login", path: "/login", Component: Login },
  { key: "logout", path: "/logout", Component: Logout },
  { key: "nutrition", path: "/nutrition", Component: Nutrition },
  { key: "register", path: "/register", Component: Register },
  { key: "foodlog", path: ["/foodlog", "/foodlog/:day"], Component: FoodLog },
  { key: "foods", path: ["/foods"], Component: Foods },
];

export function Routes() {
  return (
    <div className="relative">
      {routes.map(({ key, path, Component }) => (
        <Route key={key} path={path} exact>
          {({ match }) => {
            return (
              <CSSTransition
                in={match != null}
                classNames="router"
                timeout={1000}
                unmountOnExit
              >
                <div className="router">
                  <Component />
                </div>
              </CSSTransition>
            );
          }}
        </Route>
      ))}
    </div>
  );
}
