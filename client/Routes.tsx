import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { Home } from "./pages/Home";
import { Logout } from "./pages/Logout";
import { NotFound } from "./pages/NotFound";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Nutrition } from "./pages/Nutrition";

export function Routes() {
  const location = useLocation();
  return (
    <div className="relative">
      <TransitionGroup>
        <CSSTransition key={location.pathname} classNames="fade" timeout={1000}>
          <Switch location={location}>
            <Route path="/nutrition" component={Nutrition} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/logout" component={Logout} exact />
            <Route path="/" component={Home} exact />
            <Route component={NotFound} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}
