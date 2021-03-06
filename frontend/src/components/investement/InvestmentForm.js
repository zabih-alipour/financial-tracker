import {
  AppBar,
  Button,
  Container,
  Dialog,
  Grid,
  IconButton,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import UserAutoComplete from "../user/UserAutoComplete";
import InvestmentTypeAutoComplete from "./InvestmentTypeAutoComplete";
import InvestmentAutoComplete from "./InvestmentAutoComplete";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, { Calendar, utils } from "react-modern-calendar-datepicker";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class InvestmentForm extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = props.onClose;
    this.state = {
      open: props.openDialog,
      investment: props.investment != null ? props.investment : {},
      change: props.investment != null ? props.investment.change : {},
      subtract: props.investment != null ? props.investment.subtract : {},
    };
  }

  handleClose = (status = "NO_ACTION") => {
    this.setState({ open: false });
    this.onClose(status);
  };

  onChange = (event) => {
    console.log(event);
    this.setState((state) => ({
      investment: {
        ...state.investment,
        [event.target.name]: event.target.value,
      },
    }));
  };
  onCoinChange = (event) => {
    this.setState((state) => {
      const { name, value } = event.target;
      const change = {
        ...state.change,
        [name]: value,
      };

      if (name === "investmentType") {
        change["executedPrice"] = value.latestPrice;
      }
      return {
        change: change,
      };
    });
  };
  onSubtractChange = (event) => {
    this.setState((state) => ({
      subtract: {
        ...state.subtract,
        [event.target.name]: event.target.value,
      },
    }));
  };
  onParentChange = (event) => {
    const parent = event.target.value;
    this.setState((state) => ({
      investment: {
        ...state.investment,
        parent: parent,
      },
      subtract: {
        ...state.subtract,
        investmentType: parent.investmentType,
        amount: parent.remain,
      },
    }));
  };

  persistInvestment = () => {
    const { investment, change, subtract } = this.state;
    investment.change = change;
    investment.subtract = subtract;

    const requestOptions = {
      method: investment.id == null ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(investment),
    };
    fetch("/api/investments/v2", requestOptions).then((res) => {
      this.handleClose("SUCCESSFUL");
    });
  };

  parentpanel = () => {
    const parent = this.state.subtract;
    if (parent) {
      return (
        <Grid
          container
          spacing={3}
          style={{
            marginTop: "15px",
            border: "1px solid grey",
            borderRadius: "5px",
          }}
        >
          <Grid item lg={12}>
            <Typography align="right">اطلاعات دارایی والد</Typography>
          </Grid>

          <Grid item sx={11}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              id="tf_parent_type"
              label="نوع والد"
              variant="standard"
              placeholder="نوغ والد"
              margin="dense"
              value={parent.investmentType ? parent.investmentType.name : ""}
              disabled
            />
          </Grid>
          <Grid item sx={1}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              label="مقدار"
              id="tf_subtract_amount"
              name="amount"
              variant="standard"
              placeholder="مقدار"
              margin="dense"
              value={parent.amount}
              onChange={(event) => this.onSubtractChange(event)}
            />
          </Grid>
          <Grid item sx={1}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              id="subtract_executed_price"
              label="قیمت اعمال شده"
              name="executedPrice"
              variant="standard"
              placeholder="قیمت اعمال شده"
              margin="dense"
              value={parent.executedPrice}
              onChange={(event) => this.onSubtractChange(event)}
            />
          </Grid>
        </Grid>
      );
    }
  };

  formatDate = (date) => {
    if (!date) {
      date = utils("fa").getToday();
    }
    const { year, month, day } = utils("fa").getToday();

    return year + "/" + month + "/" + day;
  };

  render() {
    const { open, investment, change } = this.state;
    const title = investment.id == null ? " ثبت سرمایه" : " ویرایش  سرمایه";

    return (
      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
        onClose={this.handleClose}
      >
        <AppBar className="appBar">
          <Toolbar>
            <IconButton
              edge="end"
              color="inherit"
              onClick={this.handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={"title"} component="div">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container style={{ padding: "20px" }}>
          <Grid
            container
            spacing={3}
            style={{
              marginTop: "5px",
              border: "1px solid grey",
              borderRadius: "5px",
            }}
          >
            <Grid item lg={12}>
              <Typography align="right">اطلاعات کاربر</Typography>
            </Grid>
            <Grid item sx={11}>
              <UserAutoComplete
                user={investment.user}
                fieldName={"user"}
                onChange={this.onChange}
                style={{ width: "350px" }}
              />
            </Grid>
            <Grid item sx={1}>
              <TextField
                inputProps={{ min: 0, style: { textAlign: "center" } }}
                id="tf_shamsiDate"
                label="تاریخ"
                name="shamsiDate"
                variant="standard"
                placeholder="تاریخ"
                margin="dense"
                value={
                  investment.shamsiDate
                    ? investment.shamsiDate
                    : this.formatDate()
                }
                onChange={(event) => this.onChange(event)}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            style={{
              marginTop: "15px",
              border: "1px solid grey",
              borderRadius: "5px",
            }}
          >
            <Grid item lg={12}>
              <Typography align="right">جزییات دارایی</Typography>
            </Grid>
            <Grid item sx={11}>
              <InvestmentTypeAutoComplete
                type={change.investmentType}
                fieldName={"investmentType"}
                onChange={this.onCoinChange}
                style={{ width: "350px" }}
              />
            </Grid>
            <Grid item sx={1}>
              <TextField
                inputProps={{ min: 0, style: { textAlign: "center" } }}
                id="tf_coin_amount"
                label="مقدار"
                name="amount"
                variant="standard"
                placeholder="مقدار"
                margin="dense"
                value={change.amount ? change.amount : ""}
                onChange={(event) => this.onCoinChange(event)}
              />
            </Grid>
            <Grid item sx_={1}>
              <TextField
                inputProps={{ min: 0, style: { textAlign: "center" } }}
                id="tf_coin_executed_price"
                label="قیمت اعمال شده"
                name="executedPrice"
                variant="standard"
                placeholder="قیمت اعمال شده"
                margin="dense"
                value={change ? change.executedPrice : ""}
                onChange={(event) => this.onCoinChange(event)}
              />
            </Grid>
            <Grid item sx_={1}>
              <InvestmentAutoComplete
                investment={investment.investment}
                fieldName={"dummy"}
                user={investment.user}
                onChange={this.onParentChange}
                style={{ width: "300px" }}
              />
            </Grid>
          </Grid>
          {this.parentpanel()}
          <Button
            variant="contained"
            fullWidth
            autoFocus
            color="primary"
            size="large"
            margin="dense"
            onClick={this.persistInvestment}
            startIcon={<SaveIcon   style={{marginLeft:"10px"}}/>}
            style={{ marginTop: "30px" }}
          >
            ذخــیره
          </Button>
        </Container>
      </Dialog>
    );
  }
}
