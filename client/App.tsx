import * as React from "react";
import { hot } from "react-hot-loader";
import lazify from "helpers/lazifyRoute";
import Loading from "components/Loading/Primary";
import { Route, Link } from "react-router-dom";
import IsLoggedIn from "components/Auth/IsLoggedIn";
import IsLoggedOut from "components/Auth/IsLoggedOut";

const Home = lazify("pages/Home");
const Register = lazify("pages/Register");
const Logout = lazify("pages/Logout");
const Login = lazify("pages/Login");
const FoodLog = lazify("pages/FoodLog");

class App extends React.Component {
  render() {
    return (
      <>
        <h1>w8mngr</h1>
        <hr />
        <Link to="/">Home</Link>
        <IsLoggedIn>
          <>
            &nbsp;|&nbsp;<Link to="/foodlog">Food Log</Link>
            &nbsp;|&nbsp;<Link to="/logout">Logout</Link>
          </>
        </IsLoggedIn>
        <IsLoggedOut>
          <>
            &nbsp;|&nbsp;<Link to="/register">Register</Link>
            &nbsp;|&nbsp;<Link to="/login">Log In</Link>
          </>
        </IsLoggedOut>
        <hr />
        <React.Suspense fallback={<Loading />}>
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route
            exact
            path="/register"
            render={props => <Register {...props} />}
          />
          <Route exact path="/logout" render={props => <Logout {...props} />} />
          <Route exact path="/login" render={props => <Login {...props} />} />
          <Route
            exact
            path="/foodlog"
            render={props => <FoodLog {...props} />}
          />
          <Route
            exact
            path="/foodlog/:day"
            render={props => <FoodLog {...props} />}
          />
        </React.Suspense>
      </>
    );
  }
}

export default hot(module)(App);
