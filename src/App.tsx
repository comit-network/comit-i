import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import TopAppBar from "./components/TopAppBar";
import ListSwaps from "./pages/ListSwaps/ListSwaps";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const App = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <React.Fragment>
        <TopAppBar />
        <MainContent />
      </React.Fragment>
    </BrowserRouter>
  </ThemeProvider>
);

const MainContent = () => (
  <React.Fragment>
    <Route exact path="/" component={ListSwaps} />
    <Route path="/make_link" component={CreateNewSwap} />
    <Route path="/new_swap" component={LinkLandingPage} />
  </React.Fragment>
);

const CreateNewSwap = () => <div>Here is where you can create a new swap</div>;
const LinkLandingPage = () => (
  <div>Here is where you land when you click on a swap-link</div>
);

export default App;
