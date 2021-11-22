import React from "react";
import { Route, Switch } from "react-router-dom";

import { Home } from "./pages/Home";
import { Logout } from "./pages/Logout";
import { NotFound } from "./pages/NotFound";
import { Register } from "./pages/Register";

export function Routes() {
  return (
    <Switch>
      <Route path="/register" component={Register} exact />
      <Route path="/logout" component={Logout} exact />
      <Route path="/" component={Home} exact />
      <Route component={NotFound} />
    </Switch>
  );
}
