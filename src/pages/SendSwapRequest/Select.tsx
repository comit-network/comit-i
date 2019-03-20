import {
  FormControl,
  Grid,
  InputLabel,
  Select as MUISelect,
  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import pascalCase from "pascal-case";
import React from "react";

const useLedgerMUISelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "10rem"
  }
}));

export interface Selection {
  name: string;
  [parameter: string]: any;
}

export enum ParameterKind {
  Network,
  Quantity
}

export interface Parameter {
  name: string;
  type: ParameterKind;
  options?: string[];
}

interface SelectProps {
  selection: Selection;
  options: string[];
  disabledOptions?: string[];
  label: string;
  parameters: Parameter[];
  onSelectionChange: (selection: string) => void;
  onParameterChange: (name: string, value: string) => void;
}

function Select({
  selection,
  options,
  disabledOptions = [],
  parameters,
  label,
  onSelectionChange,
  onParameterChange
}: SelectProps) {
  const classes = useLedgerMUISelectStyles();
  const inputName = `${label}-input`;

  return (
    <Grid item={true} xs={12} container={true} spacing={0}>
      <Grid item={true} xs={12} md={6}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={inputName}>{label}</InputLabel>
          <MUISelect
            native={true}
            required={true}
            variant="outlined"
            value={selection.name}
            onChange={event => onSelectionChange(event.target.value)}
            inputProps={{
              name: inputName
            }}
          >
            <option key={""} />
            {options
              .filter(item => item !== "")
              .map(option => (
                <option
                  key={option}
                  disabled={disabledOptions.indexOf(option) !== -1}
                  value={option}
                >
                  {pascalCase(option)}
                </option>
              ))}
          </MUISelect>
        </FormControl>
      </Grid>
      {selection.name &&
        parameters.map(param => {
          switch (param.type) {
            case ParameterKind.Network: {
              const inputName = "network-input";
              return (
                <Grid key={param.name} item={true} xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor={inputName}> Network </InputLabel>
                    <MUISelect
                      native={true}
                      required={true}
                      value={selection[param.name] || ""}
                      onChange={event =>
                        onParameterChange(param.name, event.target.value)
                      }
                      inputProps={{
                        name: inputName
                      }}
                    >
                      <option key={""} />
                      {param.options &&
                        param.options.map(value => (
                          <option value={value} key={value}>
                            {pascalCase(value)}
                          </option>
                        ))}
                    </MUISelect>
                  </FormControl>
                </Grid>
              );
            }
            case ParameterKind.Quantity: {
              return (
                <Grid key={param.name} item={true} xs={12} md={6}>
                  <TextField
                    required={true}
                    className={classes.formControl}
                    type="number"
                    value={selection[param.name] || ""}
                    onChange={event => {
                      onParameterChange(param.name, event.target.value);
                    }}
                    label="Quantity"
                  />
                </Grid>
              );
            }
          }
        })}
    </Grid>
  );
}

export default Select;
