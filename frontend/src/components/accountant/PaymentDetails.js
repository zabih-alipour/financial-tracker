import {
  Box,
  Dialog,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { blue, grey, lightBlue, red } from "@material-ui/core/colors";

import React, { useEffect, useState } from "react";
import AmountDecorate from "../utils/AmountDecorate";
import { payment_settlement_detail, payment_by_id } from "../utils/apis";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function PaymentDetail(props) {
  const { onClose, payment } = props;
  const [open, setOpen] = useState(props.openDialog);
  const [dbPayment, setDbPayment] = useState(null);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (!dbPayment) {
      payment_by_id(payment, (res) => {
        setDbPayment(res);
        payment_settlement_detail(payment, (data) => setDetails(data));
      });
    }
  }, [payment, dbPayment]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const detailsPanel = () => {
    return details.map((row, idx) => {
      return (
        <TableRow key={idx + 1}>
          <TableCell component="th" scope="row" align="center">
            {idx + 1}
          </TableCell>
          <TableCell align="center">{row.user.name}</TableCell>
          <TableCell align="center">{row.paymentType.name}</TableCell>
          <TableCell align="center">{row.code}</TableCell>
          <TableCell align="center">{row.shamsiDate}</TableCell>
          <TableCell align="center">
            <AmountDecorate amount={row.amount} />
          </TableCell>
          <TableCell align="center">{row.created_at}</TableCell>
          <TableCell align="center">
            <p style={{ overflowWrap: "break-word" }}>{row.description}</p>
          </TableCell>
        </TableRow>
      );
    });
  };
  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      <Box p={2} pt={2}>
        <Box mb={2} borderRadius={5} border={0.5}>
          <Box display="flex">
            <Box display="flex" p={2} width="30%">
              <Box pl={1}>{"کاربر: "}</Box>
              <Box color={blue[500]} fontSize={18}>
                {payment.user.name}
              </Box>
            </Box>
            <Box display="flex" p={2} width="30%">
              <Box pl={1}>{"نوع پرداخت: "}</Box>
              <Box color={lightBlue[500]} fontSize={18}>
                {payment.paymentType.name}
              </Box>
            </Box>
            <Box display="flex" p={2} width="30%">
              <Box pl={1}>{"کد: "}</Box>
              <Box color={grey[500]} fontSize={18}>
                {payment.code}
              </Box>
            </Box>
          </Box>
          <Box display="flex">
            <Box display="flex" p={2} width="30%">
              <Box pl={1}>{"مبلغ: "}</Box>
              <Box fontSize={18}>
                <AmountDecorate amount={payment.amount} />
              </Box>
            </Box>
            <Box display="flex" p={2} width="30%">
              <Box pl={1}>{"تاریخ: "}</Box>
              <Box color={red[500]} fontSize={18}>
                {payment.shamsiDate}
              </Box>
            </Box>
            <Box display="flex" p={2} width="30%">
              <Box pl={1}>{"تاریخ ایجاد: "}</Box>
              <Box color={grey[500]} fontSize={18}>
                {payment.created_at}
              </Box>
            </Box>
          </Box>
          <Box display="flex" p={2}>
            <Box pl={1}>{"توضیحات: "}</Box>
            <Box color={grey[500]} fontSize={18}>
              {payment.description}
            </Box>
          </Box>
        </Box>
        <Box>
          <TableContainer component={Paper} style={{ direction: "rtl" }}>
            <Table>
              <TableHead style={{ backgroundColor: "orange" }}>
                <TableRow>
                  <TableCell align="center">ردیف</TableCell>
                  <TableCell align="center"> کاربر </TableCell>
                  <TableCell align="center">نوع پرداخت</TableCell>
                  <TableCell align="center">کد پرداخت</TableCell>
                  <TableCell align="center">تاریخ</TableCell>
                  <TableCell align="center">مبلغ</TableCell>
                  <TableCell align="center">تاریخ ایجاد</TableCell>
                  <TableCell align="center">توضیحات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{detailsPanel()}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Dialog>
  );
}
