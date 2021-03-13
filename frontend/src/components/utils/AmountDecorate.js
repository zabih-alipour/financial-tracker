import { Typography } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import React from "react";

export default function AmountDecorate(props) {
  const { amount, thousand, style, colorize = true, precise = true } = props;

  function getPrecise(amount) {
    if (precise) {
      return Number.parseFloat(amount).toPrecision(4);
    } else return amount;
  }

  const getText = () => {
    if (amount >= 0) {
      return (
        <Typography
          align="center"
          style={{ color: colorize ? green[500] : "black" }}
        >
          {thousand
            ? getPrecise(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
            ? getPrecise(Math.abs(amount))
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
