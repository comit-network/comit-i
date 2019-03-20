import { FormControl, Grid, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import pascalCase from "pascal-case";
import React from "react";

const useLedgerSelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "10rem"
  }
}));

export interface Ledger {
  name: string;
  parameters: Parameter[];
  [parameter: string]: any;
}

export enum ParameterKind {
  Network
}

export interface Parameter {
  name: string;
  type: ParameterKind;
  options: string[];
}

interface LedgerSelectProps {
  ledger: Ledger;
  onLedgerChange: (ledger: string) => void;
  onParameterChange: (name: string, value: string) => void;
  disabledValues: string[];
}

function ledgerOptions(): string[] {
  return ["bitcoin", "ethereum"];
}

function LedgerSelect({
  ledger,
  onLedgerChange,
  onParameterChange,
  disabledValues
}: LedgerSelectProps) {
  const classes = useLedgerSelectStyles();
  const inputName = "ledger-input";

  return (
    <Grid item={true} xs={12} container={true} spacing={0}>
      <Grid item={true} xs={12} md={6}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={inputName}>Ledger</InputLabel>
          <Select
            native={true}
            required={true}
            variant="outlined"
            value={ledger.name}
            onChange={event => onLedgerChange(event.target.value)}
            inputProps={{
              name: inputName
            }}
          >
            <option value={""} />
            {ledgerOptions().map(ledger => (
              <option
                disabled={disabledValues.indexOf(ledger) !== -1}
                value={ledger}
              >
                {pascalCase(ledger)}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {ledger &&
        ledger.parameters.map(param => {
          switch (param.type) {
            case ParameterKind.Network: {
              const inputName = "network-input";
              return (
                <Grid item={true} xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor={inputName}> Network </InputLabel>
                    <Select
                      native={true}
                      required={true}
                      value={ledger[param.name] || ""}
                      onChange={event =>
                        onParameterChange(param.name, event.target.value)
                      }
                      inputProps={{
                        name: inputName
                      }}
                    >
                      {param.options.map(value => (
                        <option value={value} key={value}>
                          {pascalCase(value)}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );
            }
          }
        })}
    </Grid>
  );
}

export default LedgerSelect;
