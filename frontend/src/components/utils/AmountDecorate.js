import { Typography } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import React from "react";

export default function AmountDecorate(props) {
  const { amount, thousand, style, colorize = true } = props;

  const getText = () => {
    if (amount >= 0) {
      return (
        <Typography
          align="center"
          style={{ color: colorize ? green[500] : "black" }}
        >
          {thousand
            ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : amount}
        </Typography>
      );
    } else {
      return (
        <Typography
          align="center"
          style={{ color: colorize ? red[500] : "black" }}
        >
          (
          {thousand
            ? Math.abs(amount)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : Math.abs(amount)}
          )
        </Typography>
      );
    }
  };
  return <Typography style={{ ...style }}>{getText()}</Typography>;
}
