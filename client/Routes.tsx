import React from "react";

import { useVerifyEmail } from "./helpers";
import { LoadableRoute } from "./components/LoadableComponent";

export function Routes() {
  useVerifyEmail();
  return (
    <div className="relative">
      <div className="toast">
        <LoadableRoute
          path="/"
          load={() => import("./pages/Home")}
          component="Home"
        />
        <LoadableRoute
          path="/login"
          load={() => import("./pages/Login")}
          component="Login"
        />
        <LoadableRoute
          path="/reset-password/:token"
          load={() => import("./pages/ResetPassword")}
          component="ResetPassword"
        />
        <LoadableRoute
          path="/forgot-password"
          load={() => import("./pages/ForgotPassword")}
          component="ForgotPassword"
        />
        <LoadableRoute
          path="/register"
          load={() => import("./pages/Register")}
          component="Register"
        />
        <LoadableRoute
          path="/nutrition"
          load={() => import("./pages/Nutrition")}
          component="Nutrition"
        />
        <LoadableRoute
          path="/foodlog"
          load={() => import("./pages/FoodLog")}
          component="FoodLog"
        />
        <LoadableRoute
          path="/foods"
          load={() => import("./pages/Foods")}
          component="Foods"
        />
        <LoadableRoute
          path="/foods/new"
          load={() => import("./pages/NewFood")}
          component="NewFood"
        />
        <LoadableRoute
          path="/foods/edit/:id"
          load={() => import("./pages/EditFood")}
          component="EditFood"
        />
        <LoadableRoute
          path="/activities"
          load={() => import("./pages/Activities")}
          component="Activities"
        />
        <LoadableRoute
          path="/activities/new"
          load={() => import("./pages/NewActivity")}
          component="NewActivity"
        />
        <LoadableRoute
          path="/activities/edit/:id"
          load={() => import("./pages/EditActivity")}
          component="EditActivity"
        />
        <LoadableRoute
          path="/activities/:id/log"
          load={() => import("./pages/ActivityLog")}
          component="ActivityLog"
        />
        <LoadableRoute
          path="/activities/:id"
          load={() => import("./pages/Activity")}
          component="Activity"
        />
        <LoadableRoute
          path="/weightlog"
          load={() => import("./pages/WeightLog")}
          component="WeightLog"
        />
        <LoadableRoute  
          path="/logout"
          load={() => import("./pages/Logout")}
          component="Logout"
        />
      </div>
    </div>
  );
}
