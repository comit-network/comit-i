import { createMuiTheme, CssBaseline, Theme } from "@material-ui/core";
import { Mixins } from "@material-ui/core/styles/createMixins";
import { ThemeProvider } from "@material-ui/styles";
import { install } from "@material-ui/styles"; // Workaround until @material-ui/styles is stable
import "promise-polyfill/src/polyfill"; // Not all environments support Promise.finally
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Web3Provider } from "./components/Web3Context";

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

install();

navigator.registerProtocolHandler(
  "web+comit",
  "http://localhost:3000/from_link?%s",
  "COMIT-i"
);

ReactDOM.render(
  <ThemeProvider theme={appTheme}>
    <Web3Provider>
      <BrowserRouter>
        <React.Fragment>
          <CssBaseline />
          <App />
        </React.Fragment>
      </BrowserRouter>
    </Web3Provider>
  </ThemeProvider>,
  document.getElementById("root")
);
