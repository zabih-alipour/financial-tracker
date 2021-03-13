import {
  Box,
  Button,
  Container,
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
import { blue, green, grey, orange, red } from "@material-ui/core/colors";
import { DeleteForever, Edit } from "@material-ui/icons";
import React from "react";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import AmountDecorate from "../utils/AmountDecorate";
import InvestmentForm from "./InvestmentForm";
import CircularProgressWithLabel from "../utils/CircularProgressWithLabel";
import ListHeader from "../utils/ListHeader";
import TuneIcon from "@material-ui/icons/Tune";
import InvestmentDetail from "./InvestmentDetails";
import { Pagination } from "@material-ui/lab";

const columns = [
  { id: "id", label: "ردیف", minWidth: 170 },
  { id: "user.name", label: "کاربر", minWidth: 100 },
  {
    id: "instumentType.name",
    label: "نوع سرمایه",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "shamsiDate",
    label: "تاریخ",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "amount",
    label: "مقدار",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "executedPrice",
    label: "قیمت خریداری شده",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "spentAmount",
    label: "مقدار مصرف شده",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "code",
    label: "کد",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "dummy",
    label: "فعالیت",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

export default class InvestmentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: "",
      selectedInvestment: null,
      pagedData: {},
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = (searchCriteria = null) => {
    fetch("/api/investments/search/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchCriteria),
    })
      .then((response) => response.json())
      .then((data) => this.setState({ pagedData: data }));
  };

  deleteInvestment = () => {
    const { selectedInvestment } = this.state;
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/investments/" + selectedInvestment.id, requestOptions).then(
      (res) => {
        this.fetchData();
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
      this.fetchData();
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
      searchAria: null,
      pagination: {
        pageSize: size,
        pageNumber: page,
      },
      sort: {
        field: "id",
        order: "DESC",
      },
    };
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
              onClick={() => this.dialogHandler("INVESTMENT_DETAIL", row)}
            >
              <TuneIcon style={{ color: blue[400] }} />
            </IconButton>
            <IconButton
              onClick={() => this.dialogHandler("INVESTMENT_FORM", row)}
            >
              <Edit style={{ color: green[500] }} />
            </IconButton>
            <IconButton
              disabled={row.spentAmount}
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
      <Container component="div" fixed style={{ marginTop: "5px" }}>
        <ListHeader
          titleArea={"سرمایه گذاری ها"}
          searchArea={<div></div>}
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
              <Box>
                <Box mt={0.5} justifyContent="center">
                  <Pagination
                    boundaryCount={2}
                    page={number}
                    count={totalPages}
                    disabled={empty}
                    color="primary"
                    onChange={this.onPageChanged}
                  />
                </Box>
              </Box>
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
        {this.showDialog()}
      </Container>
    );
  }
}
