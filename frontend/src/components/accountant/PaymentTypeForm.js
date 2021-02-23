import {
  AppBar,
  Button,
  Container,
  Dialog,
  IconButton,
  MenuItem,
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
    this.setState({ type: { ...this.state.type, name: event.target.value } });
  };

  handleChange = (event) => {
    const parentName =event.target.value;
    const parent = this.state.types.filter(p=>p.name === parentName)
    this.setState({ type: { ...this.state.type, parent: parent[0] } });
  };

  render() {
    const { open, type } = this.state;
    const title =
      type.id == null ? " تعریف دسته بندی جدید" : " ویرایش دسته بندی";
      console.log(type.parent)
    const parentName = type.parent == null ? "" : type.parent.name;
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
          <TextField
            fullWidth
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            id="standard-select-currency"
            select
            label="انتخاب"
            value={parentName}
            onChange={this.handleChange}
            
            variant="standard"
          >
            {this.state.types.map((option) => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

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
