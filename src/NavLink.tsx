import { RouteComponentProps, withRouter } from "react-router";
import { Button, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

interface NavLinkProps extends RouteComponentProps {
  to: string;
  desc: string;
}

function NavLink({ desc, history, to }: NavLinkProps) {
  const linkProps = {
    to
  };

  return (
    <Button color="inherit" component={Link as any} {...linkProps}>
      <Typography variant="h6" color="inherit">
        {desc}
      </Typography>
    </Button>
  );
}

export default withRouter(NavLink);
