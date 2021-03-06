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
    this.setState((state) => ({
      investment: {
        ...state.investment,
        [event.target.name]: event.target.value,
      },
    }));
  };
  onCoinChange = (event) => {
    this.setState((state) => ({
      change: {
        ...state.change,
        [event.target.name]: event.target.value,
      },
    }));
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
      investment:{
        ...state.investment,
        parent: parent
      },
      subtract: {
        ...state.subtract,
        investmentType: parent.investmentType,
        amount: parent.amount,
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

  parentpanel = (parent) => {
    if (parent) {
      return (
        <Grid
          container
          direction="row-reverse"
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
              variant="standard"
              placeholder="نوغ والد"
              margin="dense"
              value={parent.investmentType ? parent.investmentType.name : ""}
              disabled
            />
          </Grid>
          <Grid item sx>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              id="tf_subtract_amount"
              name="amount"
              variant="standard"
              placeholder="مقدار"
              margin="dense"
              value={parent.amount}
              onChange={(event) => this.onSubtractChange(event)}
            />
          </Grid>
          <Grid item sx>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              id="subtract_executed_price"
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

  render() {
    const { open, investment, change, subtract } = this.state;
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
            direction="row-reverse"
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
            <Grid item sx>
              <TextField
                inputProps={{ min: 0, style: { textAlign: "center" } }}
                id="tf_shamsiDate"
                name="shamsiDate"
                variant="standard"
                placeholder="تاریخ"
                margin="dense"
                value={investment.shamsiDate}
                onChange={(event) => this.onChange(event)}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row-reverse"
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
            <Grid item sx>
              <TextField
                inputProps={{ min: 0, style: { textAlign: "center" } }}
                id="tf_coin_amount"
                name="amount"
                variant="standard"
                placeholder="مقدار"
                margin="dense"
                value={change.amount ? change.amount : ""}
                onChange={(event) => this.onCoinChange(event)}
              />
            </Grid>
            <Grid item sx>
              <TextField
                inputProps={{ min: 0, style: { textAlign: "center" } }}
                id="tf_coin_executed_price"
                name="executedPrice"
                variant="standard"
                placeholder="قیمت اعمال شده"
                margin="dense"
                value={change ? change.executedPrice : ""}
                onChange={(event) => this.onCoinChange(event)}
              />
            </Grid>
            <Grid item sx>
              <InvestmentAutoComplete
                investment={investment.parent}
                fieldName={"dummy"}
                user={investment.user}
                onChange={this.onParentChange}
                style={{ width: "200px" }}
              />
            </Grid>
          </Grid>
          {this.parentpanel(subtract)}
          <Button
            variant="contained"
            fullWidth
            autoFocus
            color="primary"
            size="large"
            margin="dense"
            onClick={this.persistInvestment}
            startIcon={<SaveIcon />}
            style={{ marginTop: "30px" }}
          >
            ذخــیره
          </Button>
        </Container>
      </Dialog>
    );
  }
}
