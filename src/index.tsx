import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Not all environments support Promise.finally
import "promise-polyfill/src/polyfill";

import {install} from "@material-ui/styles"

install();
ReactDOM.render(<App />, document.getElementById("root"));
