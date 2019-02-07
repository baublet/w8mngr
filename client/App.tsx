import * as React from "react";
import { hot } from "react-hot-loader";
import lazify from "./helpers/lazifyRoute";
import Loading from "./components/Loading/Primary";
import { Route, Link } from "react-router-dom";

const Home = lazify("pages/Home");
const Register = lazify("pages/Register");

class App extends React.Component {
  render() {
    return (
      <>
        <h1>w8mngr</h1>
        <Link to="/">Home</Link> | <Link to="/register">Register</Link>
        <hr />
        <React.Suspense fallback={<Loading />}>
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route
            exact
            path="/register"
            render={props => <Register {...props} />}
          />
        </React.Suspense>
      </>
    );
  }
}

export default hot(module)(App);
