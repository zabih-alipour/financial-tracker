import { TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import React from "react";

export default function UserAutoComplete(props) {
  const [users, setUsers] = React.useState(props.users ? props.users : []);

  const { user, onChange, fieldName, style} = props;

  React.useEffect(() => {
    if (users.length === 0) {
      fetch("/api/users")
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
        });
    }
  }, [users]);

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
      id="user-auto"
      autoComplete
      onChange={onAutoCompleteChange}
      // autoHighlight
      // fullWidth
      
      value={user}
      options={users}
      renderInput={(params) => (
        <TextField style={style}
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
