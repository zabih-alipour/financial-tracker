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
import { forwardRef, useEffect, useState } from "react";
import AmountDecorate from "../utils/AmountDecorate";
import { payment_type_user_datails } from "../utils/apis";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PaymenttypeUserDetail(params) {
  const { paymentType, onClose } = params;
  const [open, setOpen] = useState(params.openDialog);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (paymentType) {
      payment_type_user_datails(paymentType, (data) => setDetails(data));
    }
  }, [paymentType]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const getSum = (fieldName) => {
    var sum = 0;
    details.forEach((element) => {
      sum += element[fieldName];
    });

    return sum;
  };

  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
      <Box p={2}>
        <Box p={2} mb={2} border={1} borderRadius={10}>
          <Box mb={1}>
            {"نوع پرداخت: "}
            {paymentType.name}
          </Box>
          <Box mb={1}>
            <AmountDecorate amount={getSum("amount")} label={"کل مبلغ: "} />
          </Box>
          <Box mb={1}>
            <AmountDecorate
              amount={getSum("settlementAmount")}
              label={"کل مبلغ تسویه شده: "}
            />
          </Box>
        </Box>
        <Box>
          <TableContainer component={Paper} style={{ direction: "rtl" }}>
            <Table>
              <TableHead style={{ backgroundColor: "orange" }}>
                <TableRow>
                  <TableCell align="center">ردیف</TableCell>
                  <TableCell align="center"> کاربر </TableCell>
                  <TableCell align="center">مبلغ</TableCell>
                  <TableCell align="center">مبلغ تسویه شده</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((row, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell align="center">{idx + 1}</TableCell>
                      <TableCell align="center"> {row.user.name} </TableCell>
                      <TableCell align="center">
                        <AmountDecorate amount={row.amount} />
                      </TableCell>
                      <TableCell align="center">
                        <AmountDecorate amount={row.settlementAmount} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Dialog>
  );
}
