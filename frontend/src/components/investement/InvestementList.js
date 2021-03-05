import {
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
import { grey, orange } from "@material-ui/core/colors";
import { DeleteForever, Edit } from "@material-ui/icons";
import React from "react";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import InvestmentForm from "./InvestmentForm";
export default class InvestmentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      investments: [],
      dialog: "",
      selectedInvestment: null,
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = () => {
    fetch("/api/investments")
      .then((response) => response.json())
      .then((data) => this.setState({ investments: data }));
  };

  deleteInvestment=()=>{
    const {selectedInvestment} = this.state;
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/investments/" + selectedInvestment.id, requestOptions).then((res) => {
      this.fetchData();
    });
  }

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
      }
      return (
        <InvestmentForm
          openDialog={true}
          investment={investment}
          onClose={this.onClose}
        />
      );
    }else if (dialog === "DELETE_INVESTMENT") {
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
              آیا مطمغن هستین که میخواید دارایی با کد {selectedInvestment.code} را حذف کنید؟
            </DialogContentText>
          }
          onAccept={this.deleteInvestment}
          onClose={this.onClose}
        />
      );
    }
  };
  render() {
    const { investments } = this.state;
    const rows = investments.map((row, idx) => {
      const { user, investmentType } = row;
      return (
        <TableRow key={idx}>
          <TableCell align="center">{idx + 1}</TableCell>
          <TableCell align="center">{user.name}</TableCell>
          <TableCell align="center">{investmentType.name}</TableCell>
          <TableCell align="center">{row.amount}</TableCell>
          <TableCell align="center">{row.executedPrice}</TableCell>
          <TableCell align="center">{row.shamsiDate}</TableCell>
          <TableCell align="center">{row.create_at}</TableCell>
          <TableCell align="center">
            {row.parent ? row.parent.code : ""}
          </TableCell>
          <TableCell align="center">{row.description}</TableCell>

          <TableCell alignItems="center">
            <IconButton  onClick={() => this.dialogHandler("DELETE_INVESTMENT", row)}>
              <DeleteForever />
            </IconButton>
            <IconButton
              onClick={() => this.dialogHandler("INVESTMENT_FORM", row)}
            >
              <Edit />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
    return (
      <Container component="div" fixed style={{ marginTop: "5px" }}>
        <Grid className="header" container>
          <Grid item xs={11}>
            <Typography
              variant="h6"
              dir="rtl"
              style={{ color: grey[300], fontSize: 30 }}
            >
              سرمایه گذاری ها
            </Typography>
          </Grid>

          <Grid item xs>
            <Button
              onClick={() => this.dialogHandler("INVESTMENT_FORM", null)}
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
            <TableHead style={{ backgroundColor: orange[200] }}>
              <TableRow>
                <TableCell align="center">ردیف</TableCell>
                <TableCell align="center">کاربر</TableCell>
                <TableCell align="center">نوع سرمایه</TableCell>
                <TableCell align="center">مقدار</TableCell>
                <TableCell align="center">قیمت خریداری شده</TableCell>
                <TableCell align="center">تاریخ</TableCell>
                <TableCell align="center">تاریخ ایجاد</TableCell>
                <TableCell align="center">والد</TableCell>
                <TableCell align="center">توضیحات</TableCell>
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
