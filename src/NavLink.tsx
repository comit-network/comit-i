import { Button, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  desc: string;
}

function NavLink({ desc, to }: NavLinkProps) {
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

export default NavLink;
