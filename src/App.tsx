import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import TopAppBar from "./components/TopAppBar";
import { Web3Provider } from "./components/Web3Context";
import ListSwaps from "./pages/ListSwaps/ListSwaps";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Web3Provider>
      <BrowserRouter>
        <React.Fragment>
          <TopAppBar />
          <MainContent />
        </React.Fragment>
      </BrowserRouter>
    </Web3Provider>
  </ThemeProvider>
);

const MainContent = () => (
  <React.Fragment>
    <Route exact={true} path="/" component={ListSwaps} />
    <Route path="/make_link" component={CreateNewSwap} />
    <Route path="/new_swap" component={LinkLandingPage} />
  </React.Fragment>
);

const CreateNewSwap = () => <div>Here is where you can create a new swap</div>;
const LinkLandingPage = () => (
  <div>Here is where you land when you click on a swap-link</div>
);

export default App;
