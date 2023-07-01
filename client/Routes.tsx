import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import { LoadableComponent } from "./components/LoadableComponent";
import { useVerifyEmail } from "./helpers/useVerifyEmail";

export function Routes() {
  useVerifyEmail();
  return (
    <div className="relative">
      <div className="toast">
        <BrowserRouter>
          <Route
            path="/"
            element={
              <LoadableComponent
                load={() => import("./pages/Home")}
                component="Home"
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoadableComponent
                load={() => import("./pages/Login")}
                component="Login"
              />
            }
          />
          <Route
            path="/logging-in"
            element={
              <LoadableComponent
                load={() => import("./pages/LoggingIn")}
                component="LoggingIn"
              />
            }
          />
          <Route
            path="/preferences"
            element={
              <LoadableComponent
                load={() => import("./pages/UserPreferences")}
                component="UserPreferences"
              />
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <LoadableComponent
                load={() => import("./pages/ResetPassword")}
                component="ResetPassword"
              />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <LoadableComponent
                load={() => import("./pages/ForgotPassword")}
                component="ForgotPassword"
              />
            }
          />
          <Route
            path="/register"
            element={
              <LoadableComponent
                load={() => import("./pages/Register")}
                component="Register"
              />
            }
          />
          <Route
            path="/nutrition"
            element={
              <LoadableComponent
                load={() => import("./pages/Nutrition")}
                component="Nutrition"
              />
            }
          />
          <Route
            path={"/foodlog/:day"}
            element={
              <LoadableComponent
                load={() => import("./pages/FoodLog")}
                component="FoodLog"
              />
            }
          />
          <Route
            path={"/foodlog"}
            element={
              <LoadableComponent
                load={() => import("./pages/FoodLog")}
                component="FoodLog"
              />
            }
          />
          <Route
            path="/foods"
            element={
              <LoadableComponent
                load={() => import("./pages/Foods")}
                component="Foods"
              />
            }
          />
          <Route
            path="/foods/new"
            element={
              <LoadableComponent
                load={() => import("./pages/NewFood")}
                component="NewFood"
              />
            }
          />
          <Route
            path="/foods/edit/:id"
            element={
              <LoadableComponent
                load={() => import("./pages/EditFood")}
                component="EditFood"
              />
            }
          />
          <Route
            path="/activities"
            element={
              <LoadableComponent
                load={() => import("./pages/Activities")}
                component="Activities"
              />
            }
          />
          <Route
            path="/activities/new"
            element={
              <LoadableComponent
                load={() => import("./pages/NewActivity")}
                component="NewActivity"
              />
            }
          />
          <Route
            path="/activities/edit/:id"
            element={
              <LoadableComponent
                load={() => import("./pages/EditActivity")}
                component="EditActivity"
              />
            }
          />
          <Route
            path={"/activities/:id/log"}
            element={
              <LoadableComponent
                load={() => import("./pages/ActivityLog")}
                component="ActivityLog"
              />
            }
          />{" "}
          <Route
            path={"/activities/:id/log/:day"}
            element={
              <LoadableComponent
                load={() => import("./pages/ActivityLog")}
                component="ActivityLog"
              />
            }
          />
          <Route
            path="/activities/:id"
            element={
              <LoadableComponent
                load={() => import("./pages/Activity")}
                component="Activity"
              />
            }
          />
          <Route
            path={"/weightlog/:day"}
            element={
              <LoadableComponent
                load={() => import("./pages/WeightLog")}
                component="WeightLog"
              />
            }
          />
          <Route
            path={"/weightlog"}
            element={
              <LoadableComponent
                load={() => import("./pages/WeightLog")}
                component="WeightLog"
              />
            }
          />
          <Route
            path="/logout"
            element={
              <LoadableComponent
                load={() => import("./pages/Logout")}
                component="Logout"
              />
            }
          />
          <Route
            path="/tos"
            element={
              <LoadableComponent
                load={() => import("./pages/TermsOfService")}
                component="TermsOfService"
              />
            }
          />
          <Route
            path="/privacy"
            element={
              <LoadableComponent
                load={() => import("./pages/Privacy")}
                component="Privacy"
              />
            }
          />
        </BrowserRouter>
      </div>
    </div>
  );
}
