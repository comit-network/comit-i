import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import "promise-polyfill/src/polyfill"; // Not all environments support Promise.finally
import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import TagManager from "react-gtm-module";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Web3Provider } from "./components/Web3Context";
import appTheme from "./theme";

navigator.registerProtocolHandler("web+comit", "/from_link?%s", "COMIT-i");

// tslint:disable:no-console
if (process.env.NODE_ENV === "production") {
  if (process.env.REACT_APP_GTM_TAG) {
    const gtmTag = process.env.REACT_APP_GTM_TAG;
    TagManager.initialize({
      gtmId: gtmTag
    });
  } else {
    console.log("Google Tag Manager tag not defined");
  }
  if (process.env.REACT_APP_GA_TAG) {
    const gaTag = process.env.REACT_APP_GA_TAG;
    ReactGA.initialize(gaTag);
    ReactGA.pageview(window.location.pathname + window.location.search);
  } else {
    console.log("Google Analytics tag not defined");
  }
}

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
