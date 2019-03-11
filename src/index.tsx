import { createMuiTheme, CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
// Not all environments support Promise.finally
import "promise-polyfill/src/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const appTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

ReactDOM.render(
  <ThemeProvider theme={appTheme}>
    <BrowserRouter>
      <React.Fragment>
        <CssBaseline />
        <App />
      </React.Fragment>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById("root")
);
