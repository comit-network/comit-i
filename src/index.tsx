import { createMuiTheme, CssBaseline, Theme } from "@material-ui/core";
import { Mixins } from "@material-ui/core/styles/createMixins";
import { ThemeProvider } from "@material-ui/styles";
// Not all environments support Promise.finally
import "promise-polyfill/src/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const mixins = {
  border: (theme: Theme) => ({
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: theme.shape.borderRadius,
    borderColor:
      theme.palette.type === "light"
        ? "rgba(0, 0, 0, 0.42)"
        : "rgba(255, 255, 255, 0.7)"
  })
} as Partial<Mixins>;

const appTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  mixins
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
