import { Tooltip } from "@material-ui/core";
import { InputBaseComponentProps } from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from "@material-ui/core/styles";
import { TextFieldProps } from "@material-ui/core/TextField";
import React, { CSSProperties, HTMLAttributes } from "react";
import Select from "react-select";
import {
  ValueContainer as RSValueContainer,
  ValueContainerProps
} from "react-select/lib/components/containers";
import { ControlProps } from "react-select/lib/components/Control";
import { MenuProps } from "react-select/lib/components/Menu";
import { ValueType } from "react-select/lib/types";
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
    input: {
      display: "flex",
      padding: 0,
      height: "auto"
    },
    valueContainer: {
      // The `emotion` styles of react-select are injected _after_ our styling, hence we need to workaround with !important.
      // If we can find out, how to change the injection position of `emotion`'s <style> tags, we can fix this.
      padding: "0 !important"
    },
    paper: {
      position: "absolute",
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0
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
        <Tooltip
          title={
            // Could make this sentence less awkward if we pass in, whether or not the PeerID belongs to our COMIT node...
            "Supply a publicly reachable address here if the COMIT node with the above PeerID is not discoverable."
          }
        >
          <span>
            A multiaddress that will be dialed in addition to the PeerID.
            Optional.
          </span>
        </Tooltip>
      }
      onChange={event => onAddressHintChange(event.target.value)}
      required={false}
      disabled={disabled}
      {...baseTextFieldProps}
    />
  );
}

function FakeInput({
  inputRef,
  ...props
}: InputBaseComponentProps & HTMLAttributes<HTMLDivElement>) {
  return <div ref={inputRef} {...props} />;
}

/*
 * Custom `Control` element for a `react-select` `Select` component.
 *
 * If we want to use a Material-UI textfield for this `Control` component,
 * we need to pass something else than an `input` as the `inputComponent`
 * because we receive `children` that we are supposed to render.
 *
 * Hence, we create this `FakeInput` element which is effectively just a
 * div.
 * `react-select` will then take care of rendering an `input` for us.
 */
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
        inputComponent: FakeInput,
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

function ValueContainer({
  children,
  ...props
}: ValueContainerProps<OptionType>) {
  const classes = useStyles();

  return (
    <RSValueContainer className={classes.valueContainer} {...props}>
      {children}
    </RSValueContainer>
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

  function onChange(event: ValueType<OptionType>) {
    if (event && !(event instanceof Array)) {
      onAddressHintChange(event.value);
    }
  }

  if (suggestions.length === 0) {
    return <InnerTextField {...innerTextFieldProps} />;
  } else {
    const options = suggestions.map(suggestion => ({
      label: suggestion,
      value: suggestion
    }));

    return (
      <Select
        openMenuOnFocus={true}
        classes={classes}
        styles={selectStyles}
        options={options}
        InnerTextFieldProps={innerTextFieldProps}
        noOptionsMessage={() => null}
        components={{
          Control,
          Menu,
          ValueContainer
        }}
        value={{
          label: addressHint,
          value: addressHint
        }}
        required={false}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }
}
