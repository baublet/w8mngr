import * as React from "react";
import * as ReactDOM from "react-dom";
import boot from "./boot";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

boot();

const MOUNT_NODE = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  MOUNT_NODE
);
