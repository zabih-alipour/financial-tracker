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
import AmountDecorate from "../utils/AmountDecorate";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class PaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = props.onClose;
    this.state = {
      open: props.openDialog,
      user: props.user,
      type: props.type,
      payments: [],
    };
  }

  handleClose = () => {
    this.setState({ open: false });
    this.onClose();
  };

  componentDidMount = () => {
    const { user, type } = this.state;
    var url = "";
    if (user != null && type != null) {
      url = "/api/payments/" + user.id + "/" + type.id;
    } else if (user != null) {
      url = "/api/payments/by-user/" + user.id;
    } else if (type != null) {
      url = "/api/payments/by-type/" + type.id;
    }
    fetch(url)
      .then((res) => res.json())
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
            <AmountDecorate amount={row.amount} />
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
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    );
  }
}
