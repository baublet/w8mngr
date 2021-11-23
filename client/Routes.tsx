import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { Home } from "./pages/Home";
import { Logout } from "./pages/Logout";
import { NotFound } from "./pages/NotFound";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Nutrition } from "./pages/Nutrition";
import { FoodLog } from "./pages/FoodLog";

const routes = [
  { key: "home", path: "/", name: "Home", Component: Home },
  { key: "login", path: "/login", Component: Login },
  { key: "logout", path: "/logout", Component: Logout },
  { key: "nutrition", path: "/nutrition", Component: Nutrition },
  { key: "register", path: "/register", Component: Register },
  { key: "foodlog", path: ["/foodlog", "/foodlog/:day"], Component: FoodLog },
  { key: "notFound", path: "/not-found", Component: NotFound },
];

export function Routes() {
  return (
    <div className="relative">
      {routes.map(({ key, path, Component }) => (
        <Route key={key} path={path} exact={path ? true : false}>
          {({ match }) => {
            return (
              <CSSTransition
                in={match != null}
                classNames="fade"
                timeout={1000}
                unmountOnExit
              >
                <div className="fade">
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
