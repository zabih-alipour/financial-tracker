import { Box, Paper, Typography } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import React from "react";

export default function AmountDecorate(props) {
  const {
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
      <Box
        align={align}
        style={{
          color: colorize ? (amount >= 0 ? green[500] : red[500]) : "black",
        }}
      >
        {thousand
          ? Math.abs(amount).toLocaleString("fullwide", {
              useGrouping: true,
            })
          : Math.abs(amount)}
      </Box>
    );
  };
  return (
    <Box  display={display}
      align={align}
      style={{
        color: colorize ? (amount >= 0 ? green[500] : red[500]) : "black",
      }}
    >
      {thousand
        ? Math.abs(amount).toLocaleString("fullwide", {
            useGrouping: true,
          })
        : Math.abs(amount)}
    </Box>
  );
}
