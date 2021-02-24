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
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import "./PaymentTypeForm.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import SaveIcon from "@material-ui/icons/Save";

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
    this.setState({
      type: { ...this.state.type, [event.target.name]: event.target.value },
    });
  };

  onAutoCompleteChange = (event, value, reason) => {
    this.setState({
      type: { ...this.state.type, parent: value },
    });
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

          <Autocomplete
            id="highlights-demo"
            autoComplete
            onChange={this.onAutoCompleteChange}
            // autoHighlight
            fullWidth
            value={type.parent}
            options={types}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="سرگروه"
                variant="standard"
                margin="normal"
              />
            )}
            getOptionSelected={(option, value) => option.name === value.name}
            renderOption={(option, { inputValue }) => {
              const matches = match(option.name, inputValue);
              const parts = parse(option.name, matches);
              return (
                <Typography
                  align="center"
                  style={{
                    width: "100%",
                    padding: "5px",
                    borderBottom: "1px dotted",
                  }}
                >
                  {parts.map((part, index) => (
                    <Typography
                    key={index}
                      style={{
                        display: "inline",
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </Typography>
                  ))}
                </Typography>
              );
              // if (type != null) {

              // }
              // if (option.id !== type.id) {
              //   if (option.path != null) {
              //     const found = option.path.match(/\d+/g);
              //     if (
              //       found != null &&
              //       type.id != null &&
              //       !found.includes(type.id)
              //     ) {
              //       return (
              //         <div
              //           style={{
              //             width: "100%",
              //             padding: "5px",
              //             borderBottom: "1px dotted",
              //           }}
              //         >
              //           {parts.map((part, index) => (
              //             <Typography fullWidth key={index} align="center">
              //               {part.text}
              //             </Typography>
              //           ))}
              //         </div>
              //       );
              //     }
              //   } else {

              //   }
              // }
            }}
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
