import { install } from "@material-ui/styles"; // Workaround until @material-ui/styles is stable
import "promise-polyfill/src/polyfill"; // Not all environments support Promise.finally
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

install();

ReactDOM.render(<App />, document.getElementById("root"));
