import {
  IconButton,
  Snackbar as MaterialSnackbar,
  SnackbarContent,
  Theme,
  Typography
} from "@material-ui/core";
import { SnackbarProps as MaterialSnackbarProps } from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  content: ({ paletteVariant, color }) => ({
    backgroundColor: theme.palette[paletteVariant][color]
  }),
  message: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing(1)
  }
}));

type PaletteColorVariant = "primary" | "secondary" | "error";
type PaletteColor = "light" | "dark" | "main";

interface StyleProps {
  paletteVariant: PaletteColorVariant;
  color: PaletteColor;
}

interface SnackbarProps {
  open: boolean;
  onClose?: () => void;
  message: string;
  icon: React.ComponentType<any>;
  backgroundPaletteVariant: PaletteColorVariant;
  backgroundColor: PaletteColor;
}

function Snackbar({
  open,
  onClose,
  message,
  icon,
  backgroundPaletteVariant,
  backgroundColor,
  ...remainingProps
}: SnackbarProps & MaterialSnackbarProps) {
  const classes = useStyles({
    paletteVariant: backgroundPaletteVariant,
    color: backgroundColor
  });

  return (
    <MaterialSnackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open}
      onClose={onClose}
      ClickAwayListenerProps={{
        onClickAway: () => undefined
      }}
      {...remainingProps}
    >
      <SnackbarContent
        classes={{
          root: classes.content,
          message: classes.message
        }}
        message={
          <React.Fragment>
            {React.createElement(icon, { className: classes.icon }, [])}
            <Typography color={"inherit"}>{message}</Typography>
          </React.Fragment>
        }
        action={
          onClose && [
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          ]
        }
      />
    </MaterialSnackbar>
  );
}

export default Snackbar;
