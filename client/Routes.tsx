import * as React from "react";
import lazify from "helpers/lazifyRoute";
import Loading from "components/Loading/Primary";
import { Route, Link } from "react-router-dom";

const Home = lazify("pages/Home");
const Register = lazify("pages/Register");
const Logout = lazify("pages/Logout");
const Login = lazify("pages/Login");
const FoodLog = lazify("pages/FoodLog");

export default function Routes(): React.ReactComponentElement<any> {
  return (
    <React.Suspense fallback={<Loading />}>
      <Route exact path="/" render={props => <Home {...props} />} />
      <Route exact path="/register" render={props => <Register {...props} />} />
      <Route exact path="/logout" render={props => <Logout {...props} />} />
      <Route exact path="/login" render={props => <Login {...props} />} />
      <Route exact path="/foodlog" render={props => <FoodLog {...props} />} />
      <Route
        exact
        path="/foodlog/:day"
        render={props => <FoodLog {...props} />}
      />
    </React.Suspense>
  );
}
