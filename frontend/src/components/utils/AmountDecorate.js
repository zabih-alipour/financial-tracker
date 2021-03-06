import { Typography } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import React from "react";

export default function AmountDecorate(props) {
  const { amount, thousand } = props;

  const getText = () => {
    if (amount >= 0) {
      return (
        <Typography align="center" style={{ color: green[500] }}>
          {thousand
            ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : amount}
        </Typography>
      );
    } else {
        
      return (
        <Typography align="center" style={{ color: red[500] }}>
          (
          {thousand
            ? Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : Math.abs(amount)}
          )
        </Typography>
      );
    }
  };
  return <Typography>{getText()}</Typography>;
}
