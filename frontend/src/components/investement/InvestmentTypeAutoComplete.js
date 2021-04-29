import { Box, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import React from "react";
import { blue, grey } from "@material-ui/core/colors";
import { investment_types_search } from "../utils/apis";

export default function InvestmentTypeAutoComplete(props) {
  const [types, setTypes] = React.useState(props.types ? props.types : []);

  const { type, onChange, fieldName, style, fullWidth = false } = props;

  const onAutoCompleteChange = (event, value, reason) => {
    event = {
      target: {
        name: fieldName,
        value: value,
      },
    };

    onChange(event);
  };

  const doSearch = (event, value, reason) => {
    const criteria = {
      searchArias: [
        {
          key: "name",
          value: value,
        },
      ],
    };

    investment_types_search(criteria, (data) => setTypes(data["content"]));
  };

  return (
    <Autocomplete
      fullWidth={fullWidth}
      id="investment-type-auto"
      autoComplete
      noOptionsText="موردی برای نمایش وجود ندارد"
      onChange={onAutoCompleteChange}
      onInputChange={doSearch}
      value={type}
      options={types}
      loading={true}
      loadingText="در حال جستچو..."
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
        return option.id === value.id;
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
                  color: part.highlight ? blue[500] : grey[600],
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
