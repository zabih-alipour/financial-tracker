import { TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import React from "react";

export default function InvestmentTypeAutoComplete(props) {
  const [types, setTypes] = React.useState(props.types ? props.types : []);

  const { type, onChange, fieldName, style } = props;

  React.useEffect(() => {
    if (types.length === 0) {
      fetch("/api/investment_types")
        .then((response) => response.json())
        .then((data) => {
          setTypes(data);
        });
    }
  }, [types]);

  const onAutoCompleteChange = (event, value, reason) => {
    event = {
      target: {
        name: [fieldName],
        value: value,
      },
    };

    onChange(event);
  };

  return (
    <Autocomplete
      id="investment-type-auto"
      autoComplete
      onChange={onAutoCompleteChange}
      // autoHighlight
      
      value={type}
      options={types}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="نوع سرمایه"
          variant="standard"
          margin="normal"
          style={style}
        />
      )}
      getOptionLabel={(option) => {
        return option.name;
      }}
      getOptionSelected={(option, value) => {
        return option.name === value.name;
      }}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        return (
          <Typography
            align="center"
            style={{
              width: "100%",
              padding: "5px",
              borderBottom: "1px dotted",
            }}
          >
            {parts.map((part, index) => (
              <Typography
                key={index}
                style={{
                  display: "inline",
                  fontWeight: part.highlight ? 700 : 400,
                }}
              >
                {part.text}
              </Typography>
            ))}
          </Typography>
        );
      }}
    />
  );
}