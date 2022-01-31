import React from "react";
import { Route, Switch } from "react-router-dom";

import { getLoadableComponentFor } from "./components/LoadableComponent";
import { useLoginWithToken, useVerifyEmail } from "./helpers";

export function Routes() {
  useVerifyEmail();
  useLoginWithToken();
  return (
    <div className="relative">
      <div className="toast">
        <Switch>
          <Route
            exact
            path="/"
            component={getLoadableComponentFor({
              load: () => import("./pages/Home"),
              component: "Home",
            })}
          />
          <Route
            exact
            path="/login"
            component={getLoadableComponentFor({
              load: () => import("./pages/Login"),
              component: "Login",
            })}
          />
          <Route
            exact
            path="/reset-password/:token"
            component={getLoadableComponentFor({
              load: () => import("./pages/ResetPassword"),
              component: "ResetPassword",
            })}
          />
          <Route
            exact
            path="/forgot-password"
            component={getLoadableComponentFor({
              load: () => import("./pages/ForgotPassword"),
              component: "ForgotPassword",
            })}
          />
          <Route
            exact
            path="/register"
            component={getLoadableComponentFor({
              load: () => import("./pages/Register"),
              component: "Register",
            })}
          />
          <Route
            exact
            path="/nutrition"
            component={getLoadableComponentFor({
              load: () => import("./pages/Nutrition"),
              component: "Nutrition",
            })}
          />
          <Route
            exact
            path={["/foodlog", "/foodlog/:day"]}
            component={getLoadableComponentFor({
              load: () => import("./pages/FoodLog"),
              component: "FoodLog",
            })}
          />
          <Route
            exact
            path="/foods"
            component={getLoadableComponentFor({
              load: () => import("./pages/Foods"),
              component: "Foods",
            })}
          />
          <Route
            exact
            path="/foods/new"
            component={getLoadableComponentFor({
              load: () => import("./pages/NewFood"),
              component: "NewFood",
            })}
          />
          <Route
            exact
            path="/foods/edit/:id"
            component={getLoadableComponentFor({
              load: () => import("./pages/EditFood"),
              component: "EditFood",
            })}
          />
          <Route
            exact
            path="/activities"
            component={getLoadableComponentFor({
              load: () => import("./pages/Activities"),
              component: "Activities",
            })}
          />
          <Route
            exact
            path="/activities/new"
            component={getLoadableComponentFor({
              load: () => import("./pages/NewActivity"),
              component: "NewActivity",
            })}
          />
          <Route
            exact
            path="/activities/edit/:id"
            component={getLoadableComponentFor({
              load: () => import("./pages/EditActivity"),
              component: "EditActivity",
            })}
          />
          <Route
            exact
            path={["/activities/:id/log", "/activities/:id/log/:day"]}
            component={getLoadableComponentFor({
              load: () => import("./pages/ActivityLog"),
              component: "ActivityLog",
            })}
          />
          <Route
            exact
            path="/activities/:id"
            component={getLoadableComponentFor({
              load: () => import("./pages/Activity"),
              component: "Activity",
            })}
          />
          <Route
            exact
            path={["/weightlog", "/weightlog/:day"]}
            component={getLoadableComponentFor({
              load: () => import("./pages/WeightLog"),
              component: "WeightLog",
            })}
          />
          <Route
            exact
            path="/logout"
            component={getLoadableComponentFor({
              load: () => import("./pages/Logout"),
              component: "Logout",
            })}
          />
          <Route
            exact
            path="/tos"
            component={getLoadableComponentFor({
              load: () => import("./pages/TermsOfService"),
              component: "TermsOfService",
            })}
          />
          <Route
            exact
            path="/privacy"
            component={getLoadableComponentFor({
              load: () => import("./pages/Privacy"),
              component: "Privacy",
            })}
          />
        </Switch>
      </div>
    </div>
  );
}
