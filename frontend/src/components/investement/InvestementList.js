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
import { blue, green, grey, orange, red } from "@material-ui/core/colors";
import { DeleteForever, Edit, Search } from "@material-ui/icons";
import React from "react";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import AmountDecorate from "../utils/AmountDecorate";
import InvestmentForm from "./InvestmentForm";
import CircularProgressWithLabel from "../utils/CircularProgressWithLabel";
import ListHeader from "../utils/ListHeader";
import TuneIcon from "@material-ui/icons/Tune";
import InvestmentDetail from "./InvestmentDetails";
import ListPagination from "../utils/ListPagination";
import InvestmentListSearch from "./InvestmentListSearch";
import { investment_search } from "../utils/apis";

export default class InvestmentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: "",
      selectedInvestment: null,
      pagedData: {},
      searchArias: null,
    };
  }

  doSearch = (searchCriteria = null) => {
    const { searchArias, pageable } = this.state.pagedData;
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
      } else criteria["searchArias"] = searchArias;
    } else criteria["searchArias"] = searchArias;

    investment_search(criteria, (data) => {
      this.setState({
        pagedData: data,
        searchArias: criteria.searchArias,
      });
    });
  };

  componentDidMount = () => {
    this.doSearch();
  };

  deleteInvestment = () => {
    const { selectedInvestment } = this.state;
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/investments/" + selectedInvestment.id, requestOptions).then(
      (res) => {
        this.doSearch();
      }
    );
  };

  dialogHandler = (dialog, investment) => {
    this.setState({
      dialog: dialog,
      selectedInvestment: investment,
    });
  };

  onClose = (status) => {
    this.setState({
      dialog: "",
      selectedInvestment: null,
    });

    if (status === "SUCCESSFUL") {
      this.doSearch();
    }
  };

  showDialog = () => {
    const { dialog, selectedInvestment } = this.state;
    if (dialog === "INVESTMENT_FORM") {
      var investment = selectedInvestment;
      if (selectedInvestment) {
        investment = {
          id: selectedInvestment.id,
          user: selectedInvestment.user,
          shamsiDate: selectedInvestment.shamsiDate,
          change: {
            investmentType: selectedInvestment.investmentType,
            amount: selectedInvestment.amount,
            executedPrice: selectedInvestment.executedPrice,
          },
        };
        if (selectedInvestment.investment) {
          investment["subtract"] = {
            investmentType: selectedInvestment.investment.investmentType,
            amount: Math.abs(selectedInvestment.investment.amount),
            executedPrice: selectedInvestment.investment.executedPrice,
          };
        }
      }
      return (
        <InvestmentForm
          openDialog={true}
          investment={investment}
          onClose={this.onClose}
        />
      );
    } else if (dialog === "DELETE_INVESTMENT") {
      return (
        <ConfirmationDialog
          data={selectedInvestment}
          openDialog={true}
          headerComponent={
            <DialogTitle id="alert-dialog-slide-title">
              {"حذف دارایی"}
            </DialogTitle>
          }
          bodyComponent={
            <DialogContentText id="alert-dialog-slide-description">
              آیا مطمغن هستین که میخواید دارایی با کد {selectedInvestment.code}{" "}
              را حذف کنید؟
            </DialogContentText>
          }
          onAccept={this.deleteInvestment}
          onClose={this.onClose}
        />
      );
    } else if (dialog === "INVESTMENT_DETAIL") {
      return (
        <InvestmentDetail
          openDialog={true}
          investment={selectedInvestment}
          onClose={this.onClose}
        />
      );
    }
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
      const { user, investmentType } = row;
      const progress =
        row.spentAmount === null
          ? 0
          : (Math.abs(row.spentAmount) / row.amount) * 100;
      return (
        <TableRow key={idx}>
          <TableCell align="center">{idx + 1}</TableCell>
          <TableCell align="center">{user.name}</TableCell>
          <TableCell align="center">{investmentType.name}</TableCell>
          <TableCell align="center">{row.shamsiDate}</TableCell>
          <TableCell align="center">
            <AmountDecorate amount={row.amount} />
          </TableCell>
          <TableCell align="center">{row.executedPrice}</TableCell>
          <TableCell align="center">
            <CircularProgressWithLabel value={progress} />
          </TableCell>
          <TableCell align="center">{row.code}</TableCell>

          <TableCell align="center">
            <IconButton
              onClick={() => this.dialogHandler('INVESTMENT_DETAIL', row)}
            >
              <TuneIcon style={{ color: blue[400] }} />
            </IconButton>
            <IconButton
              onClick={() => this.dialogHandler("INVESTMENT_FORM", row)}
            >
              <Edit style={{ color: green[500] }} />
            </IconButton>
            <IconButton
              disabled={row.spentAmount !== null}
              onClick={() => this.dialogHandler("DELETE_INVESTMENT", row)}
            >
              <DeleteForever
                style={{ color: row.spentAmount ? grey[400] : red[400] }}
              />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
    return (
      <Box display="flex" p={1}>
        <Box display="inline-block" width="20%" ml={2}>
          <InvestmentListSearch doSearch={this.doSearch} pageable={pageable} />
        </Box>
        <Box display="inline-block" width="80%">
          <ListHeader
            titleArea={"سرمایه گذاری ها"}
            searchArea={
              <div></div>
              // <UserAutoComplete
              //   fieldName="dummy"
              //   onChange={this.filterUser}
              //   fullWidth={true}
              // />
            }
            buttonAria={
              <Button
                onClick={() => this.dialogHandler("INVESTMENT_FORM", null)}
                variant="outlined"
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
              <TableHead style={{ backgroundColor: orange[500] }}>
                <TableRow>
                  <TableCell align="center">ردیف</TableCell>
                  <TableCell align="center">کاربر</TableCell>
                  <TableCell align="center">نوع سرمایه</TableCell>
                  <TableCell align="center">تاریخ</TableCell>
                  <TableCell align="center">مقدار</TableCell>
                  <TableCell align="center">قیمت خریداری شده</TableCell>
                  <TableCell align="center">مقدار مصرف شده</TableCell>
                  <TableCell align="center">کد</TableCell>
                  <TableCell align="center">فعالیت</TableCell>
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
