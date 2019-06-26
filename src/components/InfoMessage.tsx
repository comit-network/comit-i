import { Paper, Theme, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2)
  }
}));

interface InfoMessageProps {
  text: string;
  color?: "primary" | "secondary" | "error";
}

export default function InfoMessage({
  text,
  color = "primary"
}: InfoMessageProps) {
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.root}>
      <InfoIcon color={color} />
      &nbsp;
      <Typography color={color}>{text}</Typography>
    </Paper>
  );
}
