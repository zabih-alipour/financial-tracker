import { TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

export default function UserAutoComplete(props) {
  const { user, users, onChange, fieldName } = props;

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
      fullWidth
      value={user}
      options={users}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="کاربر"
          variant="standard"
          margin="normal"
        />
      )}
      getOptionSelected={(option, value) => option.name === value.name}
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
