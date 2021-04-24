import {
  Box,
  Button,
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
import { blue, cyan, green, grey, lime } from "@material-ui/core/colors";
import React from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import TuneIcon from "@material-ui/icons/Tune";
import AmountDecorate from "../utils/AmountDecorate";
import ListHeader from "../utils/ListHeader";
import {
  ShowDialog,
  PAYMENT_SETTLEMENT_KEY,
  PAYMENT_FORM_KEY,
  PAYMENT_LIST_DETAIL_KEY,
} from "../utils/Dialogs";
import PaymentListSearch from "./PaymentListSearch";
import {
  delete_payment,
  payment_search,
  settlement_payment,
} from "../utils/apis";
import ListPagination from "../utils/ListPagination";
import { Receipt } from "@material-ui/icons";

export default class PaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagedData: {},
      dialog: "",
      selectedPayment: null,
    };
  }

  componentDidMount = () => {
    this.doSearch();
  };

  onPageChanged = (event, page) => {
    const { pagedData } = this.state;
    const { size = 0 } = pagedData;

    const searchCriteria = {
      pagination: {
        pageSize: size,
        pageNumber: page - 1,
      },
    };
    this.doSearch(searchCriteria);
  };

  doSearch = (searchCriteria = null) => {
    const { pageable } = this.state.pagedData;
    const criteria = {};

    if (searchCriteria) {
      if (searchCriteria.pagination) {
        criteria["pagination"] = searchCriteria.pagination;
      } else criteria["pagination"] = pageable;

      if (searchCriteria.sort) {
        criteria["sort"] = searchCriteria.sort;
      }
      if (searchCriteria.searchArias) {
        criteria["searchArias"] = searchCriteria.searchArias;
      }
    }

    payment_search(criteria, (data) => {
      this.setState({
        pagedData: data,
      });
    });
  };

  deletePayment = () => {
    const { selectedPayment } = this.state;
    delete_payment(selectedPayment, (res) => {
      this.doSearch();
    });
  };

  settlementPayment = () => {
    const { selectedPayment } = this.state;

    settlement_payment(selectedPayment, (res) => {
      this.doSearch();
    });
  };

  onClose = (status = "NO_ACTION") => {
    this.setState({
      dialog: "",
      selectedPayment: null,
    });
    if (status === "SUCCESS") {
      this.doSearch();
    }
  };

  showDialog = () => {
    const { dialog, selectedPayment } = this.state;

    if (dialog === "DELETE_PAYMENT") {
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
    }
    return ShowDialog(
      { payment: selectedPayment, dialog: dialog },
      this.onClose
    );
  };

  dialogHandler = (dialog, payment) => {
    this.setState({ dialog: dialog, selectedPayment: payment });
  };

  render() {
    const { pagedData } = this.state;
    const {
      content = [],
      totalPages = 0,
      number = 0,
      totalElements = 0,
      empty = true,
      pageable,
    } = pagedData;

    const rows = content.map((row, idx) => {
      return (
        <TableRow key={idx + 1}>
          <TableCell component="th" scope="row" align="center">
            {idx + 1}
          </TableCell>
          <TableCell align="center">{row.user.name}</TableCell>
          <TableCell align="center">{row.paymentType.name}</TableCell>
          {/* <TableCell align="center">{row.code}</TableCell> */}
          <TableCell align="center">{row.shamsiDate}</TableCell>
          <TableCell align="center">
            <AmountDecorate amount={row.amount} thousand={true} />
          </TableCell>
          <TableCell align="center">
            <AmountDecorate amount={row.settlementAmount} thousand={true} />
          </TableCell>
          {/* <TableCell align="center">{row.created_at}</TableCell> */}
          <TableCell align="center">
            <Box
              fontSize={12}
              fontWeight={2}
              color={grey[600]}
              whiteSpace="wrap"
              width="200px"
            >
              {row.description}
            </Box>
          </TableCell>

          <TableCell align="center">
            <IconButton 
              title="جزییات"
              onClick={() => this.dialogHandler(PAYMENT_LIST_DETAIL_KEY, row)}
            >
              <Receipt
                style={{ color: cyan[500] }}
              />
            </IconButton>
            <IconButton
              disabled={row.settled === true}
              title="تسویه"
              onClick={() => this.dialogHandler(PAYMENT_SETTLEMENT_KEY, row)}
            >
              <TuneIcon
                style={{ color: !row.settled ? blue[500] : grey[400] }}
              />
            </IconButton>

            <IconButton
              onClick={() => this.dialogHandler(PAYMENT_FORM_KEY, row)}
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
      <Box p={2} display="flex" flexWrap="nowrap">
        <Box display="inline-block" style={{ width: "19%" }} ml={2}>
          <PaymentListSearch doSearch={this.doSearch} pageable={pageable} />
        </Box>
        <Box display="inline-block" style={{ width: "80%" }}>
          <ListHeader
            titleArea={"پرداخت ها"}
            searchArea={<div></div>}
            buttonAria={
              <Button
                onClick={() => this.dialogHandler(PAYMENT_FORM_KEY, null)}
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
                <ListPagination
                  number={number}
                  totalPages={totalPages}
                  empty={empty}
                  totalElements={totalElements}
                  onPageChanged={this.onPageChanged}
                />
              </caption>
              <TableHead style={{ backgroundColor: "orange" }}>
                <TableRow>
                  <TableCell align="center">ردیف</TableCell>
                  <TableCell align="center"> کاربر </TableCell>
                  <TableCell align="center">نوع پرداخت</TableCell>
                  {/* <TableCell align="center">کد پرداخت</TableCell> */}
                  <TableCell align="center">تاریخ</TableCell>
                  <TableCell align="center">مبلغ</TableCell>
                  <TableCell align="center">مبلغ تسویه شده</TableCell>
                  {/* <TableCell align="center">تاریخ ایجاد</TableCell> */}
                  <TableCell align="center">توضیحات</TableCell>
                  <TableCell align="center">اکشن</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </TableContainer>
        </Box>
        {this.showDialog()}
      </Box>
    );
  }
}
