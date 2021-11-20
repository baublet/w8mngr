import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { boot } from "./boot";
import { Application } from "./Application";

boot();

const MOUNT_NODE = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter>
    <Application />
  </BrowserRouter>,
  MOUNT_NODE
);
