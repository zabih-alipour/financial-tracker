import { Box, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import React from "react";
import { get_users } from "../utils/apis";
import { blue, grey } from "@material-ui/core/colors";

export default function UserAutoComplete(props) {
  const [options, setOptions] = React.useState(props.users ? props.users : []);

  const {
    onChange,
    fieldName,
    style,
    fullWidth = false,
    multiple = false,
  } = props;

  const selectedOptions = multiple
    ? props.user
      ? [props.user]
      : []
    : props.user;

  React.useEffect(() => {
    if (options.length === 0) {
      get_users((data) => {
        setOptions(data);
      });
    }
  }, [options]);

  const onAutoCompleteChange = (event, value, reason) => {
    event = {
      target: {
        name: fieldName,
        value: value,
      },
    };

    onChange(event);
  };

  return (
    <Autocomplete
      id="user-auto"
      // autoComplete
      onChange={onAutoCompleteChange}
      // autoHighlight
      multiple={multiple}
      fullWidth={fullWidth}
      value={selectedOptions}
      options={options}
      renderInput={(params) => (
        <TextField
          style={style}
          {...params}
          label="کاربر"
          placeholder="کاربر"
          variant="standard"
          margin="dense"
        />
      )}
      getOptionLabel={(option) => {
        return option.name;
      }}
      getOptionSelected={(option, value) => {
        if (multiple) {
          const selected = value.filter((opt, idx) => opt.id === value.id);
          return selected > 0;
        } else {
          return option.id === value.id;
        }
      }}
      // renderTags={(value, getTagProps) =>
      //   value.map((option, index) => {
      //     return (
      //       <Chip
      //         variant="outlined"
      //         label={option.name}
      //         {...getTagProps({ index })}
      //       />
      //     );
      //   })
      // }
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
