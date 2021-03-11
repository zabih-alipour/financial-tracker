import {
  Box,
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
import { blue } from "@material-ui/core/colors";
import React, { useState, useEffect } from "react";
import AmountDecorate from "../utils/AmountDecorate";
import TuneIcon from "@material-ui/icons/Tune";
import { ShowChart } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InvestmentDetail(props) {
  const [investment, setInvestment] = useState(props.investment);
  const [details, setDetails] = useState([]);
  const [child, setChild] = useState(null);
  const [open, setOpen] = useState(props.openDialog);
  const { onClose, fullScreen } = props;

  useEffect(() => {
    if (investment) {
      fetch("/api/investments/details/" + investment.id)
        .then((response) => response.json())
        .then((details) => {
          setDetails(details);
        });
    }
  }, [investment]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const headerComponent = () => {
    return (
      <Box borderBottom={1} p={2}>
        <Box borderBottom={0.5} mb={2} p={1} fontSize={20}>
          {investment.user.name}
        </Box>
        <Box>
          <Box display="inline-block" width={2 / 6}>
            {investment.investmentType.name}
          </Box>
          <Box display="inline-block" width={1 / 6}>
            {investment.code}
          </Box>
          <Box display="inline-block" width={1 / 6}>
            {investment.shamsiDate}
          </Box>
          <Box display="inline-block" width={1 / 6}>
            <AmountDecorate amount={investment.amount} thousand={true} />
          </Box>
        </Box>
        <Box>
          <Box display="inline-block" width={1 / 4}>
            {investment.create_at}
          </Box>
          <Box display="inline-block" width={1} flexGrow={1}>
            {investment.description}
          </Box>
        </Box>
      </Box>
    );
  };

  const detailRows = () => {
    return details.map((row, idx) => {
      return (
        <TableRow key={idx + 1}>
          <TableCell align="center">{idx + 1}</TableCell>
          <TableCell align="center"> {row.user.name} </TableCell>
          <TableCell align="center">{row.investmentType.name}</TableCell>
          <TableCell align="center">{row.code}</TableCell>
          <TableCell align="center">{row.shamsiDate}</TableCell>
          <TableCell align="center">
            <AmountDecorate amount={row.amount} thousand={true} />
          </TableCell>
          <TableCell align="center">{row.create_at}</TableCell>
          <TableCell align="center">{row.description}</TableCell>
          <TableCell align="center">
            <IconButton onClick={() => setChild(row)}>
              <TuneIcon style={{ color: blue[400] }} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  const showChild = () => {
    console.log(child);
    if (child !== null) {
      return (
        <InvestmentDetail
          open={true}
          investment={child}
          onClose={() => setChild(null)}
          fullScreen={false}
        />
      );
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen ? fullScreen : true}
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      {headerComponent()}
      <TableContainer component={Paper} style={{ direction: "rtl" }}>
        <Table>
          <TableHead style={{ backgroundColor: "orange" }}>
            <TableRow>
              <TableCell align="center">ردیف</TableCell>
              <TableCell align="center"> کاربر </TableCell>
              <TableCell align="center">نوع سرمایه</TableCell>
              <TableCell align="center">کد پیگیری</TableCell>
              <TableCell align="center">تاریخ</TableCell>
              <TableCell align="center">مبلغ</TableCell>
              <TableCell align="center">تاریخ ایجاد</TableCell>
              <TableCell align="center">توضیحات</TableCell>
              <TableCell align="center">جزییات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{detailRows()}</TableBody>
        </Table>
      </TableContainer>
      {showChild()}
    </Dialog>
  );
}
