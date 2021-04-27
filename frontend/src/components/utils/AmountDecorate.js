import { Box, Paper, Typography } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import React from "react";

export default function AmountDecorate(props) {
  const {
    label = null,
    amount,
    thousand = true,
    style,
    display = "block",
    colorize = true,
    precise = true,
    align = "center",
  } = props;

  const getText = () => {
    return (
      <Box>
        {thousand
          ? Math.abs(amount).toLocaleString("fullwide", {
              useGrouping: true,
            })
          : Math.abs(amount)}
      </Box>
    );
  };
  return (
    <Box
      display={display}
      align={align}
      style={{
        color: colorize ? (amount >= 0 ? green[500] : red[500]) : "black",
      }}
    >
      <Box
        color="text.secondary"
        width={label ? "50%" : "0%"}
        display="inline-block"
        textAlign="right"
      >
        {label}
      </Box>
      <Box
        display="inline-block"
        width={label ? "50%" : "100%"}
        textAlign={label ? "left" : "center"}
      >
        {thousand
          ? Math.abs(amount).toLocaleString("fullwide", {
              useGrouping: true,
            })
          : Math.abs(amount)}
      </Box>
    </Box>
  );
}
