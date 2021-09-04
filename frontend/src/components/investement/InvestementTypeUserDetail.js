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
import { investment_type_user_datails } from "../utils/apis";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InvestmentTypeUserDetail(params) {
  const { investmentType, onClose } = params;
  const [open, setOpen] = useState(params.openDialog);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (investmentType) {
      investment_type_user_datails(investmentType, (data) => {
        console.log(data);
        setDetails(data);
      }
      );
    }
  }, [investmentType]);

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
            {"نوع دارایی: "}
            {investmentType.name}
          </Box>
          <Box mb={1}>
            <AmountDecorate amount={getSum("amount")} label={"کل دارایی خریداری شده: "} />
          </Box>
          <Box mb={1}>
            <AmountDecorate amount={getSum("spentAmount")} label={"کل دارایی استفاده شده: "} />
          </Box>
          <Box mb={1}>
            <AmountDecorate amount={getSum("amount") + getSum("spentAmount") } label={"موجودی: "} />
          </Box>


        </Box>
        <Box>
          <TableContainer component={Paper} style={{ direction: "rtl" }}>
            <Table>
              <TableHead style={{ backgroundColor: "orange" }}>
                <TableRow>
                  <TableCell align="center">ردیف</TableCell>
                  <TableCell align="center"> کاربر </TableCell>
                  <TableCell align="center">مقدار خریداری شده</TableCell>
                  <TableCell align="center">مقدار خرج شده</TableCell>
                  <TableCell align="center">مانده</TableCell>
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
                        <AmountDecorate amount={row.spentAmount} />
                      </TableCell>
                      <TableCell align="center">
                        <AmountDecorate amount={row.amount + row.spentAmount} />
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
