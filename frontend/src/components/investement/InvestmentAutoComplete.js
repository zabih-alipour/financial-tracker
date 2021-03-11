import { Box, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import React from "react";

export default function UserAutoComplete(props) {
  const [investments, setInvestments] = React.useState(
    props.investments ? props.investments : []
  );
  const { investment, onChange, fieldName, style, user } = props;

  React.useEffect(() => {
    if (user) {
      fetch("/api/investments/by-code/" + user.id)
        .then((response) => response.json())
        .then((data) => {
          setInvestments(data);
        });
    }
  }, [user]);

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
      id="investment_type_auto"
      autoComplete
      onChange={onAutoCompleteChange}
      // autoHighlight
      fullWidth
      value={investment}
      options={investments}
      renderInput={(params) => (
        <TextField
          label="دارایی"
          style={style}
          {...params}
          placeholder="دارایی"
          variant="standard"
          margin="dense"
        />
      )}
      getOptionLabel={(option) => {
        return option.code;
      }}
      getOptionSelected={(option, value) => {
        return option.code === value.code;
      }}
      renderOption={(option, { inputValue }) => {
        console.log(option.id +" = " + investment );
        if (true) {
          const matches = match(option.code, inputValue);
          const parts = parse(option.code, matches);
          return (
            <Box fontSize={12} borderBottom={1} width={1}>
              <Box width={1} color="info.main" fontSize={15}>
                {option.investmentType.name}
              </Box>
              <Box width={1} p={1}>
                <Box display="inline-block" width="40%">
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
                </Box>
                <Box display="inline-block" width="30%">
                  {option.remain}
                </Box>
                <Box display="inline-block" width="30%">
                  {option.shamsiDate}
                </Box>
              </Box>
            </Box>
          );
        } else return null;
      }}
    />
  );
}
