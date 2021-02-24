import { TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

export default function PaymentTypeAutoComplete(props) {
  const { type, types, onChange, fieldName} = props;

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
      id="payment-type-auto"
      autoComplete
      onChange={onAutoCompleteChange}
      // autoHighlight
      fullWidth
      value={type}
      options={types}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="سرگروه"
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
        // if (type != null) {

        // }
        // if (option.id !== type.id) {
        //   if (option.path != null) {
        //     const found = option.path.match(/\d+/g);
        //     if (
        //       found != null &&
        //       type.id != null &&
        //       !found.includes(type.id)
        //     ) {
        //       return (
        //         <div
        //           style={{
        //             width: "100%",
        //             padding: "5px",
        //             borderBottom: "1px dotted",
        //           }}
        //         >
        //           {parts.map((part, index) => (
        //             <Typography fullWidth key={index} align="center">
        //               {part.text}
        //             </Typography>
        //           ))}
        //         </div>
        //       );
        //     }
        //   } else {

        //   }
        // }
      }}
    />
  );
}
