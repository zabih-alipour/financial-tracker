import { Box, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { blue, grey } from "@material-ui/core/colors";
import React, { useState } from "react";
import { get_payment_types } from "../utils/apis";

export default function PaymentTypeAutoComplete(props) {
  const { type, onChange, fieldName } = props;
  const [types, setTypes] = useState([]);

  const onAutoCompleteChange = (event, value, reason) => {
    event = {
      target: {
        name: [fieldName],
        value: Array.isArray(value) ? value[0] : value,
      },
    };

    onChange(event);
  };

  React.useEffect(() => {
    if (types.length === 0) {
      get_payment_types((data) => setTypes(data));
    }
  }, [types]);

  return (
    <Autocomplete
      id="payment-type-auto"
      autoComplete
      onChange={onAutoCompleteChange}
      // autoHighlight
      fullWidth
      value={type}
      options={types}
      getOptionLabel={(option) => {
        if (Array.isArray(option)) return option[0].name;
        else return option.name;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="سرگروه"
          variant="standard"
          margin="normal"
        />
      )}
      getOptionSelected={(option, value) => {
        if (Array.isArray(value)) return option.name === value[0].name;
        else return option.name === value.name;
      }}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        return (
          <Box
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
                  color: part.highlight ? blue[700] : grey[800],
                  fontWeight: part.highlight ? 700 : 400,
                }}
              >
                {part.text}
              </Typography>
            ))}
          </Box>
        );
      }}
    />
  );
}
