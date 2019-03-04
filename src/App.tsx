import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <MainContent />
  </BrowserRouter>
);

const MainContent = () => (
  <React.Fragment>
    <Route exact path="/" component={ListSwaps} />
    <Route path="/make_link" component={CreateNewSwap} />
    <Route path="/new_swap" component={LinkLandingPage} />
  </React.Fragment>
);

const ListSwaps = () => <div>Here is where we will list all swaps</div>;
const CreateNewSwap = () => <div>Here is where you can create a new swap</div>;
const LinkLandingPage = () => (
  <div>Here is where you land when you click on a swap-link</div>
);

export default App;
