import {
  Box,
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
import { green, grey } from "@material-ui/core/colors";
import React from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import PaymentForm from "./PaymentForm";
import TuneIcon from "@material-ui/icons/Tune";
import AmountDecorate from "../utils/AmountDecorate";
import ListHeader from "../utils/ListHeader";
import { Pagination } from "@material-ui/lab";
import UserAutoComplete from "../user/UserAutoComplete";

export default class PaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagedData: {},
      dialog: "",
      selectedPayment: null,
      filteredUser: null,
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = (searchCriteria = null) => {
    fetch("/api/payments/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchCriteria),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          pagedData: data,
        });
      })
      .catch((e) => console.log(e));
  };

  deletePayment = () => {
    const { selectedPayment } = this.state;
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/payments/" + selectedPayment.id, requestOptions).then((res) => {
      this.fetchData();
    });
  };

  settlementPayment = () => {
    const { selectedPayment } = this.state;

    const settlenemt = { id: selectedPayment.id };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settlenemt),
    };
    fetch("/api/payments/settlement", requestOptions).then((res) => {
      this.fetchData();
    });
  };

  onClose = (status = "NO_ACTION") => {
    this.setState({
      dialog: "",
      selectedPayment: null,
    });
    if (status === "SUCCESS") {
      this.fetchData();
    }
  };

  showDialog = () => {
    const { dialog, selectedPayment } = this.state;
    if (dialog === "PAYMENT_FORM") {
      return (
        <PaymentForm
          openDialog={true}
          payment={selectedPayment}
          onClose={this.onClose}
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
          onClose={this.onClose}
        />
      );
    } else if (dialog === "SETTLEMENT_PAYMENT") {
      return (
        <ConfirmationDialog
          data={selectedPayment}
          openDialog={true}
          headerComponent={
            <DialogTitle id="alert-dialog-slide-title">
              {"تسویه پرداخت"}
            </DialogTitle>
          }
          bodyComponent={
            <DialogContentText id="alert-dialog-slide-description">
              آیا پرداخت با کد {selectedPayment.code} تسویه شود؟
            </DialogContentText>
          }
          onAccept={this.settlementPayment}
          onClose={this.onClose}
        />
      );
    }
  };

  dialogHandler = (dialog, payment) => {
    this.setState({ dialog: dialog, selectedPayment: payment });
  };

  onPageChanged = (event, page) => {
    const { pagedData, filteredUser } = this.state;
    const { size = 0 } = pagedData;

    const search = [];
    if (filteredUser) {
      search.push({
        key: "user.id",
        value: filteredUser.id,
      });
    }
    const searchCriteria = {
      searchArias: search,
      pagination: {
        pageSize: size,
        pageNumber: page - 1,
      },
      sort: {
        field: "id",
        order: "DESC",
      },
    };
    this.fetchData(searchCriteria);
  };

  filterUser = (event) => {
    const user = event.target.value;
    this.setState({ filteredUser: user });

    var searchCriteria = null;
    if (user) {
      searchCriteria = {
        searchArias: [
          {
            key: "user.id",
            value: user.id,
          },
        ],
        pagination: {
          pageSize: 5,
          pageNumber: 0,
        },
        sort: {
          field: "shamsiDate",
          order: "DESC",
        },
      };
    }
    this.fetchData(searchCriteria);
  };

  render() {
    const { pagedData } = this.state;
    const {
      content = [],
      totalPages = 0,
      number = 0,
      empty = true,
    } = pagedData;

    const rows = content.map((row, idx) => {
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
            <AmountDecorate amount={row.amount} thousand={true} />
          </TableCell>
          <TableCell align="center">{row.created_at}</TableCell>
          <TableCell align="center">
            <Box fontSize={12} fontWeight={2} color={grey[600]}>
              {row.description}
            </Box>
          </TableCell>

          <TableCell align="center">
            {row.amount > 0 ? (
              <IconButton
                title="تسویه"
                onClick={() => this.dialogHandler("SETTLEMENT_PAYMENT", row)}
              >
                <TuneIcon color="primary" />
              </IconButton>
            ) : (
              <IconButton
                disabled
                title="تسویه"
                onClick={() => this.dialogHandler("SETTLEMENT_PAYMENT", row)}
              >
                <TuneIcon style={{ color: grey[400] }} />
              </IconButton>
            )}

            <IconButton
              onClick={() => this.dialogHandler("PAYMENT_FORM", row)}
              title="ویرایش"
            >
              <EditIcon style={{ color: green[300] }} />
            </IconButton>
            <IconButton
              title="حذف"
              onClick={() => this.dialogHandler("DELETE_PAYMENT", row)}
            >
              <DeleteForeverIcon color="secondary" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Container>
        <ListHeader
          titleArea={"پرداخت ها"}
          searchArea={
            <UserAutoComplete
              fieldName="dummy"
              fullWidth={true}
              onChange={this.filterUser}
            />
          }
          buttonAria={
            <Button
              onClick={() => this.dialogHandler("PAYMENT_FORM", null)}
              variant="contained"
              style={{ backgroundColor: "white" }}
            >
              جــدیــد
            </Button>
          }
        />
        <TableContainer component={Paper}>
          <Table>
            <caption>
              <Box>
                <Box mt={0.5} justifyContent="center">
                  <Pagination
                    boundaryCount={2}
                    page={number + 1}
                    count={totalPages}
                    disabled={empty}
                    color="primary"
                    onChange={this.onPageChanged}
                  />
                </Box>
              </Box>
            </caption>
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
