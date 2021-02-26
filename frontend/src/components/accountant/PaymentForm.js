import {
  AppBar,
  Button,
  Container,
  Dialog,
  IconButton,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import "./PaymentForm.css";
import PaymentTypeAutoComplete from "./PaymentTypeAutoComplete";
import UserAutoComplete from "../user/UserAutoComplete";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.openDialog,
      onAccept: props.onAccept,
      onReject: props.onReject,
      types: [],
      users: [],
      payment:
        props.payment != null
          ? props.payment
          : {
              id: null,
              paymentType: null,
              user: null,
              amount: 0,
              shamsiDate: "",
              description: "",
            },
    };
  }
  componentDidMount = () => {
    fetch("/api/paymentTypes")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ types: data });
      });
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ users: data });
      });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.state.onReject();
  };

  accept = () => {
    this.handleClose();
    this.state.onAccept(this.state.payment);
  };

  onChange = (event) => {
    this.setState((state) => ({
      payment: {
        ...state.payment,
        [event.target.name]: event.target.value,
      },
    }));
  };

  render() {
    const { open, payment, types, users } = this.state;
    const title = payment.id == null ? " تعریف پرداخت جدید" : " ویرایش پرداخت";
    return (
      <Dialog
        // fullScreen
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
          <UserAutoComplete
            user={payment.user}
            users={users}
            onChange={this.onChange}
            fieldName="user"
          />

          <PaymentTypeAutoComplete
            type={payment.paymentType}
            types={types}
            onChange={this.onChange}
            fieldName="paymentType"
          />

          <TextField
            fullWidth
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            id="tf_date"
            variant="standard"
            placeholder="تاریخ"
            name="shamsiDate"
            margin="dense"
            value={payment.shamsiDate}
            onChange={(event) => this.onChange(event)}
          />

          <TextField
            fullWidth
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            id="tf_amount"
            margin="dense"
            name="amount"
            variant="standard"
            placeholder="مبلغ"
            value={payment.amount}
            onChange={(event) => this.onChange(event)}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="dense"
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            id="tf_desc"
            name="description"
            variant="outlined"
            placeholder="توضیحات"
            value={payment.description}
            onChange={(event) => this.onChange(event)}
          />

          <Button
            fullWidth
            margin="dense"
            autoFocus
            className="saveButton"
            onClick={this.accept}
            style={{ marginTop: "30px" }}
          >
            ذخــیره
          </Button>
        </Container>
      </Dialog>
    );
  }
}
