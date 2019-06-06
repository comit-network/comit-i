import Paper from "@material-ui/core/Paper";
import {
  createStyles,
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
import TextField from "./TextField";

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
      flexGrow: 1
    },
    input: {
      display: "flex",
      padding: 0,
      height: "auto"
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
    <TextField
      value={addressHint}
      label={"Peer Address Hint"}
      helperText={
        "Multiaddress format, to be dialed to help with resolution of the peer ID"
      }
      onChange={event => onAddressHintChange(event.target.value)}
      required={false}
      disabled={disabled}
      {...baseTextFieldProps}
    />
  );
}

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> &
  HTMLAttributes<HTMLDivElement>;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<OptionType>) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, InnerTextFieldProps }
  } = props;

  const { "data-cy": dataCy, ...other } = InnerTextFieldProps;

  return (
    <InnerTextField
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
          "data-cy": dataCy
        }
      }}
      {...other}
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
    disabled,
    "data-cy": "address-hint-input"
  };

  if (suggestions.length === 0) {
    return <InnerTextField {...innerTextFieldProps} />;
  } else {
    return (
      <div className={classes.root}>
        <Select
          openMenuOnFocus={true}
          classes={classes}
          styles={selectStyles}
          options={suggestions.map(suggestion => ({
            label: suggestion,
            value: suggestion
          }))}
          InnerTextFieldProps={innerTextFieldProps}
          components={{
            Control,
            Menu,
            NoOptionsMessage: () => null
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
