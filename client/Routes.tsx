import React from "react";
import { Route, Switch } from "wouter";

import { LoadableComponent } from "./components/LoadableComponent";
import { useVerifyEmail } from "./helpers/useVerifyEmail";

export function Routes() {
  useVerifyEmail();
  return (
    <Switch>
      <Route
        path="/"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/Home")}
            component="Home"
          />
        )}
      />
      <Route
        path="/login"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/Login")}
            component="Login"
          />
        )}
      />
      <Route
        path="/logging-in"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/LoggingIn")}
            component="LoggingIn"
          />
        )}
      />
      <Route
        path="/preferences"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/UserPreferences")}
            component="UserPreferences"
          />
        )}
      />
      <Route
        path="/reset-password/:token"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/ResetPassword")}
            component="ResetPassword"
          />
        )}
      />
      <Route
        path="/forgot-password"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/ForgotPassword")}
            component="ForgotPassword"
          />
        )}
      />
      <Route
        path="/register"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/Register")}
            component="Register"
          />
        )}
      />
      <Route
        path="/nutrition"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/Nutrition")}
            component="Nutrition"
          />
        )}
      />
      <Route
        path={"/foodlog/:day"}
        component={() => (
          <LoadableComponent
            load={() => import("./pages/FoodLog")}
            component="FoodLog"
          />
        )}
      />
      <Route
        path={"/foodlog"}
        component={() => (
          <LoadableComponent
            load={() => import("./pages/FoodLog")}
            component="FoodLog"
          />
        )}
      />
      <Route
        path="/foods"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/Foods")}
            component="Foods"
          />
        )}
      />
      <Route
        path="/foods/new"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/NewFood")}
            component="NewFood"
          />
        )}
      />
      <Route
        path="/foods/edit/:id"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/EditFood")}
            component="EditFood"
          />
        )}
      />
      <Route
        path="/activities"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/Activities")}
            component="Activities"
          />
        )}
      />
      <Route
        path="/activities/new"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/NewActivity")}
            component="NewActivity"
          />
        )}
      />
      <Route
        path="/activities/edit/:id"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/EditActivity")}
            component="EditActivity"
          />
        )}
      />
      <Route
        path={"/activities/:id/log"}
        component={() => (
          <LoadableComponent
            load={() => import("./pages/ActivityLog")}
            component="ActivityLog"
          />
        )}
      />
      <Route
        path={"/activities/:id/log/:day"}
        component={() => (
          <LoadableComponent
            load={() => import("./pages/ActivityLog")}
            component="ActivityLog"
          />
        )}
      />
      <Route
        path="/activities/:id"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/Activity")}
            component="Activity"
          />
        )}
      />
      <Route
        path="/activity-library/:id"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/ActivityLibraryActivity")}
            component="ActivityLibraryActivity"
          />
        )}
      />
      <Route
        path="/activity-library"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/ActivityLibrary")}
            component="ActivityLibrary"
          />
        )}
      />
      <Route
        path={"/weightlog/:day"}
        component={() => (
          <LoadableComponent
            load={() => import("./pages/WeightLog")}
            component="WeightLog"
          />
        )}
      />
      <Route
        path={"/weightlog"}
        component={() => (
          <LoadableComponent
            load={() => import("./pages/WeightLog")}
            component="WeightLog"
          />
        )}
      />
      <Route
        path="/logout"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/Logout")}
            component="Logout"
          />
        )}
      />
      <Route
        path="/tos"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/TermsOfService")}
            component="TermsOfService"
          />
        )}
      />
      <Route
        path="/privacy"
        component={() => (
          <LoadableComponent
            load={() => import("./pages/Privacy")}
            component="Privacy"
          />
        )}
      />
    </Switch>
  );
}
