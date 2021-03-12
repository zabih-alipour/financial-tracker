import {
  Box,
  Dialog,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { blue, grey, red } from "@material-ui/core/colors";
import React, { useState, useEffect } from "react";
import AmountDecorate from "../utils/AmountDecorate";
import TuneIcon from "@material-ui/icons/Tune";
import { ShowChart } from "@material-ui/icons";

const create_styles = makeStyles({
  info_lable: {
    display: "inline-block",
    color: grey[500],
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InvestmentDetail(props) {
  const style_classes = create_styles();

  const [originInvestment, setOriginInvestment] = useState({});
  const [details, setDetails] = useState([]);
  const [child, setChild] = useState(null);
  const [open, setOpen] = useState(props.openDialog);
  const { onClose, fullScreen, investment } = props;

  useEffect(() => {
    if (investment) {
      fetch("/api/investments/details/" + investment.id)
        .then((response) => response.json())
        .then((details) => {
          setOriginInvestment(details[0]);
          if (details.length > 1) {
            setDetails(details.slice(1));
          }
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
          <Box display="inline-block" width={1 / 2}>
            {investment.user.name}
          </Box>
          <Box display="inline-block" width={1 / 2}>
            {investment.investmentType.name}
          </Box>
        </Box>
        <Box>
          <Box display="inline-block" width={1 / 4}>
            <Typography className={style_classes.info_lable}>
              {"کد: "}
            </Typography>{" "}
            {investment.code}
          </Box>
          <Box display="inline-block" width={1 / 4}>
            <Typography className={style_classes.info_lable}>
              {"تاریخ تراکنش: "}
            </Typography>{" "}
            {investment.shamsiDate}
          </Box>
          <Box display="inline-block" width={1 / 4}>
            <Typography className={style_classes.info_lable}>
              {"مبلغ: "}
            </Typography>
            <AmountDecorate
              style={{ display: "inline-block", padding: "2px" }}
              amount={investment.amount}
              thousand={true}
            />
          </Box>
          <Box display="inline-block" width={1 / 4}>
            <Typography className={style_classes.info_lable}>
              {"قیمت اعمال شده: "}
            </Typography>
            <AmountDecorate
              style={{ display: "inline-block", padding: "2px" }}
              amount={investment.executedPrice}
              thousand={true}
            />
          </Box>
        </Box>
        <Box pt={2}>
          <Box display="inline-block" width={1 / 4}>
            <Typography className={style_classes.info_lable}>
              {"تاریخ ایجاد: "}
            </Typography>
            {originInvestment.create_at}
          </Box>
          <Box display="inline-block" width={3/4}>
          <Typography className={style_classes.info_lable}>
            {"توضیحات: "}
          </Typography>
          {originInvestment.description}
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
              <TableCell align="center">نوع سرمایه</TableCell>
              <TableCell align="center">کد پیگیری</TableCell>
              <TableCell align="center">تاریخ</TableCell>
              <TableCell align="center">مبلغ</TableCell>
              <TableCell align="center">قیمت اعمال شده</TableCell>
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
