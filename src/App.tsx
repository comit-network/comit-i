import {
  AppBar,
  createMuiTheme,
  createStyles,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Toolbar,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/Inbox";
import SendIcon from "@material-ui/icons/Send";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import LinkPlus from "./components/LinkPlus";
import ListSwaps from "./pages/ListSwaps/ListSwaps";

const appTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const drawerWidth = 240;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3
    },
    toolbar: theme.mixins.toolbar,
    grow: {
      flexGrow: 1
    }
  });

interface AppProps extends WithStyles<typeof styles> {}

const App = ({ classes }: AppProps) => (
  <ThemeProvider theme={appTheme}>
    <BrowserRouter>
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              COMIT-i
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          anchor="left"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <Divider />
          <List>
            <ListItem button={true} key={"swaps"}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Swaps"} />
            </ListItem>

            <ListItem button={true} key={"new_swap_link"}>
              <ListItemIcon>
                <LinkPlus />
              </ListItemIcon>
              <ListItemText primary={"Create swap link"} />
            </ListItem>

            <ListItem button={true} key={"send_swap"}>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary={"Send swap request"} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Route exact={true} path="/" component={ListSwaps} />
          <Route path="/make_link" component={CreateNewSwap} />
          <Route path="/new_swap" component={LinkLandingPage} />
        </main>
      </div>
    </BrowserRouter>
  </ThemeProvider>
);

const CreateNewSwap = () => <div>Here is where you can create a new swap</div>;
const LinkLandingPage = () => (
  <div>Here is where you land when you click on a swap-link</div>
);

export default withStyles(styles)(App);
