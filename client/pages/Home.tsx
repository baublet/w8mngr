import * as React from "react";
import {
  BrowserRouter,
  Route,
  Link,
  RouteComponentProps
} from "react-router-dom";

export default class Home extends React.Component<RouteComponentProps> {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Link to="/register">Register</Link>
      </div>
    );
  }
}
