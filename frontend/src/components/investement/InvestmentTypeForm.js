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
import SaveIcon from "@material-ui/icons/Save";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class InvestmentTypeForm extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = props.onClose;
    this.state = {
      open: props.openDialog,
      type:
        props.type != null
          ? props.type
          : { name: "", code: "", latestPrice: "" },
    };
  }

  handleClose = (status = "NO_ACTION") => {
    this.setState({ open: false });
    this.onClose(status);
  };
  onChange = (event) => {
    this.setState((state) => ({
      type: { ...state.type, [event.target.name]: event.target.value },
    }));
  };
  persistType = () => {
    const { type } = this.state;
    const requestOptions = {
      method: type.id == null ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(type),
    };
    fetch("/api/investment_types", requestOptions).then((res) => {
      this.handleClose("SUCCESSFUL");
    });
  };

  render() {
    const { open, type } = this.state;
    const title = type.id == null ? " تعریف نوع سرمایه" : " ویرایش نوع سرمایه";
    return (
      <Dialog
        
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
            id="tf_name"
            name="name"
            variant="standard"
            placeholder="عنوان"
            margin="dense"
            value={type.name}
            onChange={(event) => this.onChange(event)}
          />
          <TextField
            fullWidth
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            id="tf_code"
            name="code"
            variant="standard"
            margin="dense"
            placeholder="کد"
            value={type.code}
            onChange={(event) => this.onChange(event)}
          />
          <TextField
            fullWidth
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            id="tf_latestPrice"
            name="latestPrice"
            variant="standard"
            margin="dense"
            placeholder="آخرین قیمت"
            value={type.latestPrice}
            onChange={(event) => this.onChange(event)}
          />

          <Button
            variant="contained"
            fullWidth
            autoFocus
            color="primary"
            size="large"
            margin="dense"
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
