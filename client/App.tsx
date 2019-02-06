import * as React from "react";
import { hot } from "react-hot-loader";
import { Route, Switch } from "react-router-dom";
import lazify from "./helpers/lazify";

const Home = lazify("pages/Home");
const Register = lazify("pages/Register");
class App extends React.Component {
  render() {
    return (
      <React.Suspense fallback={<b>Loading...</b>}>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route
          exact
          path="/register"
          render={props => <Register {...props} />}
        />
      </React.Suspense>
    );
  }
}

export default hot(module)(App);
