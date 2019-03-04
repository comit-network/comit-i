import React from "react";
import { BrowserRouter, Link as RouterLink, Route, RouteComponentProps } from "react-router-dom";
import { AppBar, createMuiTheme, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import NavLink from "./NavLink";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
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

const useTopAppBarStyles = makeStyles({
  grow: {
    flexGrow: 1
  },
});

function TopAppBar() {
  const classes = useTopAppBarStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          COMIT-i
        </Typography>
        <NavLink to={"/make_link"} desc={"New SWAP link"}/>
        <NavLink to={"/"} desc={"List swaps"}/>
      </Toolbar>
    </AppBar>
  );
}

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
