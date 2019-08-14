import {
  AppBar,
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
import SettingsIcon from "@material-ui/icons/Settings";
import React from "react";
import CookieConsent from "react-cookie-consent";
import {
  Redirect,
  Route,
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import LinkPlusIcon from "./components/LinkPlus";
import LinkLandingPage from "./pages/LinkLandingPage/LinkLandingPage";
import MakeLink from "./pages/MakeLink/MakeLink";
import SendSwap from "./pages/SendSwapRequest/SendSwapRequest";
import Settings from "./pages/Settings/Settings";
import ShowResource from "./pages/ShowResource";

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
      padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    grow: {
      flexGrow: 1
    }
  });

interface AppProps extends WithStyles<typeof styles>, RouteComponentProps {}

function App({ classes, history }: AppProps) {
  const goToSwaps = () => history.push("/show_resource/swaps");
  const goToMakeLink = () => history.push("/make_link");
  const goToSendSwap = () => history.push("/send_swap");
  const goToSettings = () => history.push("/settings");

  return (
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
          <ListItem button={true} key={"swaps"} onClick={goToSwaps}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={"Swaps"} />
          </ListItem>

          <ListItem button={true} key={"new_swap_link"} onClick={goToMakeLink}>
            <ListItemIcon>
              <LinkPlusIcon />
            </ListItemIcon>
            <ListItemText primary={"Create swap link"} />
          </ListItem>

          <ListItem button={true} key={"send_swap"} onClick={goToSendSwap}>
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary={"Send swap request"} />
          </ListItem>
          <ListItem button={true} key={"settings"} onClick={goToSettings}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route
          exact={true}
          path="/"
          render={() => <Redirect to="/show_resource/swaps" />}
        />
        <Route path="/show_resource" component={ShowResource} />
        <Route path="/make_link" component={MakeLink} />
        <Route path="/send_swap" component={SendSwap} />
        <Route path="/from_link" component={LinkLandingPage} />
        <Route path="/settings" component={Settings} />

        <CookieConsent
          location="bottom"
          buttonText="Sure, I'm happy to help!"
          cookieName="comiti"
          expires={150}
          buttonClasses="btn btn-primary"
          style={{ zIndex: 99999 }}
          contentClasses="text-capitalize"
        >
          This website uses cookies to enhance the user experience.{" "}
          <span style={{ fontSize: "10px" }}>
            Additionally it uses Google Analytics to learn how you are using
            this website so that we can improve it and optimize it for your
            needs.
          </span>
        </CookieConsent>
      </main>
    </div>
  );
}

export default withStyles(styles)(withRouter(App));
