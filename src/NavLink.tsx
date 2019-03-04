import { RouteComponentProps, withRouter } from "react-router";
import {
  Typography,
  WithStyles,
  createStyles,
  withStyles
} from "@material-ui/core";
import React from "react";

const styles = createStyles({
  link: {
    marginLeft: "1rem",
    marginRight: "1rem"
  }
});

interface NavLinkProps extends RouteComponentProps, WithStyles<typeof styles> {
  to: string;
  desc: string;
}

function NavLink({ to, desc, history, classes }: NavLinkProps) {
  return (
    <Typography variant="h6" color="inherit" className={classes.link}>
      <a onClick={() => history.push(to)}>{desc}</a>
    </Typography>
  );
}

export default withStyles(styles)(withRouter(NavLink));
