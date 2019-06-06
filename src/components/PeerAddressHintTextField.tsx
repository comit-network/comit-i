import { TextField as MUITextField } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {
  createStyles,
  emphasize,
  makeStyles,
  Theme,
  useTheme
} from "@material-ui/core/styles";
import {
  BaseTextFieldProps,
  TextFieldProps
} from "@material-ui/core/TextField";
import React, { CSSProperties, HTMLAttributes } from "react";
import Select from "react-select";
import { ControlProps } from "react-select/lib/components/Control";
import { MenuProps } from "react-select/lib/components/Menu";

interface PeerAddressHintTextFieldProps {
  addressHint: string;
  onAddressHintChange?: (newAddressHint: string) => void;
  disabled?: boolean;
  suggestions?: string[];
}

interface OptionType {
  label: string;
  value: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: 250
    },
    input: {
      display: "flex",
      padding: 0,
      height: "auto"
    },
    valueContainer: {
      display: "flex",
      flexWrap: "wrap",
      flex: 1,
      alignItems: "center",
      overflow: "hidden"
    },
    chip: {
      margin: theme.spacing(0.5, 0.25)
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === "light"
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
        0.08
      )
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2)
    },
    singleValue: {
      fontSize: 16
    },
    placeholder: {
      position: "absolute",
      left: 2,
      bottom: 6,
      fontSize: 16
    },
    paper: {
      position: "absolute",
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0
    },
    divider: {
      height: theme.spacing(2)
    }
  })
);

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> &
  HTMLAttributes<HTMLDivElement>;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

interface InnerTextFieldProps {
  addressHint: string;
  onAddressHintChange: (newAddressHint: string) => void;
  disabled: boolean;
}

function InnerTextField({
  addressHint,
  onAddressHintChange,
  disabled,
  ...baseTextFieldProps
}: InnerTextFieldProps & TextFieldProps) {
  return (
    <MUITextField
      fullWidth={true}
      value={addressHint}
      label={"Peer Address Hint"}
      helperText={
        "Multiaddress format, to be dialed to help with resolution of the peer ID"
      }
      data-cy="address-hint-input"
      onChange={event => onAddressHintChange(event.target.value)}
      required={false}
      disabled={disabled}
      {...baseTextFieldProps}
    />
  );
}

function Control(props: ControlProps<OptionType>) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, InnerTextFieldProps }
  } = props;

  return (
    <InnerTextField
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps
        }
      }}
      {...InnerTextFieldProps}
    />
  );
}

function Menu(props: MenuProps<OptionType>) {
  return (
    <Paper
      square={true}
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

export default function PeerAddressHintTextField({
  addressHint,
  onAddressHintChange = () => undefined,
  disabled = false,
  suggestions = []
}: PeerAddressHintTextFieldProps) {
  const classes = useStyles();
  const theme = useTheme();

  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };

  const innerTextFieldProps = {
    addressHint,
    onAddressHintChange,
    disabled
  };

  if (suggestions.length === 0) {
    return <InnerTextField {...innerTextFieldProps} />;
  } else {
    return (
      <div className={classes.root}>
        <Select
          classes={classes}
          styles={selectStyles}
          options={suggestions.map(suggestion => ({
            label: suggestion,
            value: suggestion
          }))}
          InnerTextFieldProps={innerTextFieldProps}
          components={{
            Control,
            Menu
          }}
          value={{
            label: addressHint,
            value: addressHint
          }}
          required={false}
          disabled={disabled}
          onChange={event => {
            if (event && !(event instanceof Array)) {
              onAddressHintChange(event.value);
            }
          }}
        />
        <div className={classes.divider} />
      </div>
    );
  }
}
