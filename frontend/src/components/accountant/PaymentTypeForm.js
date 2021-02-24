import {
  AppBar,
  Button,
  Container,
  Dialog,
  Divider,
  IconButton,
  MenuItem,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { createRef } from "react";
import CloseIcon from "@material-ui/icons/Close";
import "./PaymentTypeForm.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import SaveIcon from "@material-ui/icons/Save";
import PaymentTypeAutoComplete from "./PaymentTypeAutoComplete";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class PaymentTypeForm extends React.Component {
  constructor(props) {
    super(props);
    this.transition = createRef(Transition);
    this.state = {
      open: props.openDialog,
      onAccept: props.onAccept,
      onReject: props.onReject,
      types: props.types,
      type:
        props.type != null ? props.type : { id: null, name: "", parent: null },
    };
  }

  handleClose = () => {
    this.setState({ open: false });
    this.state.onReject();
  };

  accept = () => {
    this.handleClose();
    this.state.onAccept(this.state.type);
  };
  onChange = (event) => {
    this.setState((state) => ({
      type: { ...state.type, [event.target.name]: event.target.value },
    }));
  };

  render() {
    const { open, type, types } = this.state;
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
            types={types}
            onChange={this.onChange}
            fieldName="parent"
          />

          <Button
            variant="contained"
            fullWidth
            autoFocus
            color="primary"
            size="large"
            onClick={this.accept}
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
