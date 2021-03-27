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
import React, { createRef } from "react";
import CloseIcon from "@material-ui/icons/Close";
import "./PaymentTypeForm.css";
import SaveIcon from "@material-ui/icons/Save";
import PaymentTypeAutoComplete from "./PaymentTypeAutoComplete";
import { payment_type_persist } from "../utils/apis";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class PaymentTypeForm extends React.Component {
  constructor(props) {
    super(props);
    this.transition = createRef(Transition);
    this.onClose = props.onClose;
    this.state = {
      open: props.openDialog,
      type:
        props.type != null ? props.type : { id: null, name: "", parent: null },
    };
  }

  persistType = () => {
    const { type } = this.state;
    payment_type_persist(type, (res) => {
      this.handleClose("SUCCESSFUL");
    });
  };

  handleClose = (status = "NO_ACTION") => {
    this.setState({ open: false });
    this.onClose(status);
  };

  onChange = (event) => {
    this.setState((state) => ({
      type: { ...state.type, [event.target.name]: event.target.value },
    }));
  };

  render() {
    const { open, type } = this.state;
    const title =
      type.id == null ? " تعریف دسته بندی جدید" : " ویرایش دسته بندی";
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
          <TextField
            fullWidth
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            id="standard-basic"
            name="name"
            variant="standard"
            placeholder="نام دسته بندی"
            value={type.name}
            onChange={(event) => this.onChange(event)}
          />

          <PaymentTypeAutoComplete
            type={type.parent}
            onChange={this.onChange}
            fieldName="parent"
          />

          <Button
            variant="contained"
            fullWidth
            autoFocus
            color="primary"
            size="large"
            onClick={this.persistType}
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
