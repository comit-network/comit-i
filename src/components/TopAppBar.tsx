import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import NavLink from "./NavLink";
import { makeStyles } from "@material-ui/styles";

const useTopAppBarStyles = makeStyles({
  grow: {
    flexGrow: 1
  }
});

function TopAppBar() {
  const classes = useTopAppBarStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          COMIT-i
        </Typography>
        <NavLink to={"/make_link"} desc={"New SWAP link"} />
        <NavLink to={"/"} desc={"List swaps"} />
      </Toolbar>
    </AppBar>
  );
}

export default TopAppBar;
