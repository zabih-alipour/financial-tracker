import {
  Button,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import React from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import PaymentForm from "./PaymentForm";

export default class PaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      dialog: "",
      selectedPayment: null,
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = () => {
    fetch("/api/payments")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          payments: data,
        });
      })
      .catch((e) => console.log(e));
  };

  deletePayment = (payment) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/payments/" + payment.id, requestOptions).then((res) => {
      this.fetchData();
    });
  };

  persistPayment = (payment) => {
    const requestOptions = {
      method: payment.id == null ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    };
    fetch("/api/payments", requestOptions).then((res) => {
      this.fetchData();
    });
  };

  onReject = () => {
    this.setState({
      dialog: "",
      selectedPayment: null,
    });
  };

  showDialog = () => {
    const { dialog, selectedPayment } = this.state;
    if (dialog === "PAYMENT_FORM") {
      return (
        <PaymentForm
          openDialog={true}
          payment={selectedPayment}
          onAccept={this.persistPayment}
          onReject={this.onReject}
        />
      );
    } else if (dialog === "DELETE_PAYMENT") {
      return (
        <ConfirmationDialog
          data={selectedPayment}
          openDialog={true}
          headerComponent={
            <DialogTitle id="alert-dialog-slide-title">
              {"حذف پرداخت"}
            </DialogTitle>
          }
          bodyComponent={
            <DialogContentText id="alert-dialog-slide-description">
              آیا مطمغن هستین که میخواید پرداخت را حذف کنید؟
            </DialogContentText>
          }
          onAccept={this.deletePayment}
          onReject={this.onReject}
        />
      );
    }
  };

  dialogHandler = (dialog, payment) => {
    this.setState({ dialog: dialog, selectedPayment: payment });
  };

  render() {
    const { payments } = this.state;
    const rows = payments.map((row, idx) => {
      return (
        <TableRow key={row.id}>
          <TableCell component="th" scope="row" align="center">
            {idx + 1}
          </TableCell>
          <TableCell align="center">{row.user.name}</TableCell>
          <TableCell align="center">{row.paymentType.name}</TableCell>
          <TableCell align="center">{row.shamsiDate}</TableCell>
          <TableCell align="center">{row.amount}</TableCell>
          <TableCell align="center">{row.description}</TableCell>
          <TableCell align="center">
            <IconButton>
              <EditIcon
                onClick={() => this.dialogHandler("PAYMENT_FORM", row)}
                style={{ color: green[300] }}
              />
            </IconButton>
            <IconButton>
              <DeleteForeverIcon
                onClick={() => this.dialogHandler("DELETE_PAYMENT", row)}
                color="secondary"
              />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <div
        style={{
          marginTop: "20px",
          margin: "10px auto ",
          width: "60%",
          flex: "row",
        }}
      >
        <Grid
          className="header"
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={11}>
            <Typography
              variant="h6"
              dir="rtl"
              style={{ color: grey[300], fontSize: 30 }}
            >
              پرداخت ها
            </Typography>
          </Grid>

          <Grid item xs justify="alignContent">
            <Button
              onClick={() => this.dialogHandler("PAYMENT_FORM", null)}
              variant="outlined"
              fullWidth
              style={{ backgroundColor: "white" }}
            >
              جــدیــد
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "orange" }}>
              <TableRow>
                <TableCell align="center">ردیف</TableCell>
                <TableCell align="center"> کاربر </TableCell>
                <TableCell align="center">نوع پرداخت</TableCell>
                <TableCell align="center">تاریخ</TableCell>
                <TableCell align="center">مبلغ</TableCell>
                <TableCell align="center">توضیحات</TableCell>
                <TableCell align="center">اکشن</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
        {this.showDialog()}
      </div>
    );
  }
}
