import {
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
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class PaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = props.onClose
    this.state = {
      open: props.openDialog,
      user: props.user,
      type: props.type,
      payments: [],
    };
  }

  handleClose = () => {
    this.setState({ open: false });
    this.onClose()
  };

  componentDidMount = () => {
    const { user, type } = this.state;
    console.log(this.state);
    fetch("/api/payments/" + user.id + "/" + type.id)
    .then(res=>res.json())
    .then((res) => {
      this.setState({
        payments: res,
      });
    });
  };

  render() {
    const { open, payments } = this.state;
    const rows = payments.map((row, idx) => {
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
            {row.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </TableCell>
          <TableCell align="center">{row.created_at}</TableCell>
          <TableCell align="center">
            <p style={{ overflowWrap: "break-word" }}>{row.description}</p>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
        onClose={this.handleClose}
      >
        <TableContainer component={Paper} style={{direction:"rtl"}}>
          <Table >
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
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    );
  }
}
