import {
  Dialog,
  IconButton,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { blue, grey, red } from "@material-ui/core/colors";
import React, { useState, useEffect } from "react";
import AmountDecorate from "../utils/AmountDecorate";
import TuneIcon from "@material-ui/icons/Tune";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InvestmentDetail(props) {

  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(props.openDialog);
  const { user, type, onClose, fullScreen } = props;

  useEffect(() => {
    var url = "/api/investments/details";
    if (user && type)
      url = "/api/investments/details/" + user.id + "/" + type.id;
    else if (user) url = "/api/investments/details/by-user/" + user.id;
    else if (type) url = "/api/investments/details/by-type/" + type.id;

    fetch(url)
      .then((response) => response.json())
      .then((details) => {
        setDetails(details);
      });
  }, [user, type]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  
  const detailRows = () => {
    return details.map((row, idx) => {
      return (
        <TableRow key={idx + 1}>
          <TableCell align="center">{idx + 1}</TableCell>
          <TableCell align="center">{row.user.name}</TableCell>
          <TableCell align="center">{row.investmentType.name}</TableCell>
          <TableCell align="center">{row.code}</TableCell>
          <TableCell align="center">{row.shamsiDate}</TableCell>
          <TableCell align="center">
            <AmountDecorate amount={row.amount} thousand={true} />
          </TableCell>
          <TableCell align="center">
            <AmountDecorate
              amount={row.executedPrice}
              thousand={true}
              colorize={false}
            />
          </TableCell>
          <TableCell align="center">{row.create_at}</TableCell>
          <TableCell align="center">{row.description}</TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Dialog
      fullScreen={fullScreen ? fullScreen : true}
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      <TableContainer component={Paper} style={{ direction: "rtl" }}>
        <Table>
          <TableHead style={{ backgroundColor: "orange" }}>
            <TableRow>
              <TableCell align="center">ردیف</TableCell>
              <TableCell align="center">کاربر</TableCell>
              <TableCell align="center">نوع سرمایه</TableCell>
              <TableCell align="center">کد پیگیری</TableCell>
              <TableCell align="center">تاریخ</TableCell>
              <TableCell align="center">مبلغ</TableCell>
              <TableCell align="center">قیمت اعمال شده</TableCell>
              <TableCell align="center">تاریخ ایجاد</TableCell>
              <TableCell align="center">توضیحات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{detailRows()}</TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
}
