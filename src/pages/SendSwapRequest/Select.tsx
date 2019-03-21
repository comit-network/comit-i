import { Grid } from "@material-ui/core";
import pascalCase from "pascal-case";
import React from "react";
import TextField from "../../components/TextField";
import { Parameter, ParameterKind } from "../../ledgerSpec";

export interface Selection {
  name: string;
  [parameter: string]: any;
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
  return (
    <Grid item={true} xs={12} container={true} spacing={0}>
      <Grid item={true} xs={12} md={6}>
        <TextField
          label={label}
          required={true}
          value={selection.name}
          onChange={event => onSelectionChange(event.target.value)}
          select={true}
          SelectProps={{
            native: true
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
        </TextField>
      </Grid>
      {selection.name &&
        parameters.map(param => {
          switch (param.type) {
            case ParameterKind.Network: {
              return (
                <Grid key={param.name} item={true} xs={12} md={6}>
                  <TextField
                    label={"Network"}
                    required={true}
                    value={selection[param.name] || ""}
                    onChange={event =>
                      onParameterChange(param.name, event.target.value)
                    }
                    select={true}
                    SelectProps={{
                      native: true
                    }}
                  >
                    <option key={""} />
                    {param.options &&
                      param.options.map(value => (
                        <option value={value} key={value}>
                          {pascalCase(value)}
                        </option>
                      ))}
                  </TextField>
                </Grid>
              );
            }
            case ParameterKind.Quantity: {
              return (
                <Grid key={param.name} item={true} xs={12} md={6}>
                  <TextField
                    label="Quantity"
                    required={true}
                    type="number"
                    value={selection[param.name] || ""}
                    onChange={event => {
                      onParameterChange(param.name, event.target.value);
                    }}
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
