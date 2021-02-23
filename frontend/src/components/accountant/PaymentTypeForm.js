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
import "./PaymentTypeForm.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class PaymentTypeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.openDialog,
      onAccept: props.onAccept,
      onReject: props.onReject,
      types: props.types,
      type: props.type != null ? props.type : { id: null, name: "" },
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
    this.setState({ type: { ...this.state.type, name: event.target.value } });
  };
  render() {
    const { open, type } = this.state;
    const title =
      type.id == null ? " تعریف دسته بندی جدید" : " ویرایش دسته بندی";
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
          <TextField
            fullWidth
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            id="standard-basic"
            variant="standard"
            placeholder="نام دسته بندی"
            value={type.name}
            onChange={(event) => this.onChange(event)}
          />
          <Button
            fullWidth
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
