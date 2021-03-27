import {
  Button,
  Container,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { green, lime, orange, purple } from "@material-ui/core/colors";
import React from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import PostAddIcon from "@material-ui/icons/PostAdd";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import ListHeader from "../utils/ListHeader";
import { delete_payment_type, get_payment_types } from "../utils/apis";
import { ShowDialog } from "../utils/Dialogs";

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
    get_payment_types((data) => {
      this.setState({
        paymentTypes: data,
      });
    });
  };

  deleteType = () => {
    const { selectedType } = this.state;
    delete_payment_type(selectedType, (res) => {
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
    const { dialog, selectedType } = this.state;

    if (dialog === "DELETE_TYPE") {
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
    } else
      return ShowDialog({ type: selectedType, dialog: dialog }, this.onClose);
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
            <IconButton title={"تعریف پرداخت"}
              onClick={() => this.dialogHandler("PAYMENT_FORM", row)}
            >
              <PostAddIcon style={{ color: purple[600] }} />
            </IconButton>
            <IconButton title={"پرداخت ها"}
              onClick={() => this.dialogHandler("PAYMENT_LIST_POPUP", row)}
            >
              <ReceiptIcon color="primary" />
            </IconButton>
            <IconButton title={"ویرایش"}
              onClick={() => this.dialogHandler("PAYMENT_TYPE_FORM", row)}
            >
              <EditIcon style={{ color: green[300] }} />
            </IconButton>
            <IconButton  title={"حذف"} onClick={() => this.dialogHandler("DELETE_TYPE", row)}>
              <DeleteForeverIcon color="secondary" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Container>
        <ListHeader
          titleArea={"دسته بندی"}
          searchArea={<div></div>}
          buttonAria={
            <Button
              onClick={() => this.dialogHandler("PAYMENT_TYPE_FORM", null)}
              variant="contained"
              style={{ backgroundColor: "white" }}
            >
              جــدیــد
            </Button>
          }
        />
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
      </Container>
    );
  }
}
