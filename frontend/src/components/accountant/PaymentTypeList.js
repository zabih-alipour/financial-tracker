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
import ReceiptIcon from "@material-ui/icons/Receipt";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import PaymentTypeForm from "./PaymentTypeForm";
import PaymentTypePopup from "./PaymentTypePopup";
import PaymentListPopup from "./PaymentListPopup";

export default class PaymentTypeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentTypes: [],
      dialog: "",
      selectedType: null,
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = () => {
    fetch("/api/paymentTypes")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          paymentTypes: data,
        });
      });
  };

  deleteType = () => {
    const { selectedType } = this.state;
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/paymentTypes/" + selectedType.id, requestOptions).then((res) => {
      this.fetchData();
    });
  };

  onClose = (status) => {
    this.setState({
      dialog: "",
      selectedType: null,
    });
    if (status === "SUCCESSFUL") {
      this.fetchData();
    }
  };
  onSelected = (type) => {};

  showDialog = () => {
    const { dialog, selectedType, paymentTypes } = this.state;
    if (dialog === "TYPE_FORM") {
      return (
        <PaymentTypeForm
          openDialog={true}
          types={paymentTypes}
          type={selectedType}
          onClose={this.onClose}
        />
      );
    } else if (dialog === "DELETE_TYPE") {
      return (
        <ConfirmationDialog
          data={selectedType}
          openDialog={true}
          headerComponent={
            <DialogTitle id="alert-dialog-slide-title">
              {"حذف دسته بندی"}
            </DialogTitle>
          }
          bodyComponent={
            <DialogContentText id="alert-dialog-slide-description">
              آیا مطمغن هستین که میخواید دسته یندی {selectedType.name} را حذف
              کنید؟
            </DialogContentText>
          }
          onAccept={this.deleteType}
          onClose={this.onClose}
        />
      );
    } else if (dialog === "TYPE_PAYMENT") {
      return (
        <PaymentListPopup
          openDialog={true}
          user={null}
          type={selectedType}
          onClose={this.onClose}
        />
      );
    }
  };

  dialogHandler = (dialog, type) => {
    this.setState({ dialog: dialog, selectedType: type });
  };

  render() {
    const { paymentTypes } = this.state;
    const rows = paymentTypes.map((row) => {
      const parentName = row.parent != null ? row.parent.name : " ";
      return (
        <TableRow key={row.id}>
          <TableCell component="th" scope="row" align="center">
            {row.id}
          </TableCell>
          <TableCell align="center">{row.name}</TableCell>
          <TableCell align="center">{parentName}</TableCell>
          <TableCell align="center">
            <IconButton onClick={() => this.dialogHandler("TYPE_PAYMENT", row)}>
              <ReceiptIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => this.dialogHandler("TYPE_FORM", row)}>
              <EditIcon style={{ color: green[300] }} />
            </IconButton>
            <IconButton onClick={() => this.dialogHandler("DELETE_TYPE", row)}>
              <DeleteForeverIcon color="secondary" />
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
        <Grid className="header" container alignItems="center">
          <Grid item xs={11}>
            <Typography
              variant="h6"
              dir="rtl"
              style={{ color: grey[300], fontSize: 30 }}
            >
              دسته بندی
            </Typography>
          </Grid>

          <Grid item xs>
            <Button
              onClick={() => this.dialogHandler("TYPE_FORM", null)}
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
                <TableCell align="center" style={{ width: "50%" }}>
                  عنوان
                </TableCell>
                <TableCell align="center" style={{ width: "20%" }}>
                  سرگروه
                </TableCell>
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
