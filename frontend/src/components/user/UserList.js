import React from "react";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  DialogTitle,
  DialogContentText,
} from "@material-ui/core";
import UserListItem from "./UserListItem";
import { yellow, grey } from "@material-ui/core/colors";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import "./UserList.css";
import AlertDialogSlide from "../dialog/ConfirmationDialog";
import UserForm from "./UserForm";
import PaymentListPopup from "../accountant/PaymentListPopup";

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      dialog: "",
      selectedUser: null,
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = () => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ users: data, filteredUsers: data });
      });
  };

  onChange = (event) => {
    this.setState({
      filteredUsers: this.state.users.filter((p) =>
        p.name.startsWith(event.target.value)
      ),
    });
  };

  deletUser = () => {
    const { selectedUser } = this.state;
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/users/" + selectedUser.id, requestOptions).then((res) => {
      this.fetchData();
    });
  };
  onClose = (status) => {
    this.setState({
      dialog: "",
      selectedUser: null,
    });

    if (status === "SUCCESSFUL") {
      this.fetchData();
    }
  };

  showDialog = () => {
    const { selectedUser, dialog } = this.state;
    if (dialog === "USER_FORM") {
      return (
        <UserForm
          user={selectedUser}
          openDialog={true}
          onClose={this.onClose}
        />
      );
    } else if (dialog === "DELETE_USER") {
      return (
        <AlertDialogSlide
          data={selectedUser}
          openDialog={true}
          headerComponent={
            <DialogTitle id="alert-dialog-slide-title">
              {"حذف کاربر"}
            </DialogTitle>
          }
          bodyComponent={
            <DialogContentText id="alert-dialog-slide-description">
              آیا مطمغن هستین که میخواید کاربر {selectedUser.name} را حذف کنید؟
            </DialogContentText>
          }
          onAccept={this.deletUser}
          onClose={this.onClose}
        />
      );
    } else if (dialog === "USER_PAYMENT") {
      return (
        <PaymentListPopup
          openDialog={true}
          user={selectedUser}
          type={null}
          onClose={this.onClose}
        />
      );
    }
  };

  dialogHandler = (dialog, user) => {
    this.setState({ dialog: dialog, selectedUser: user });
  };

  render() {
    const { filteredUsers } = this.state;
    const userItems = filteredUsers.map((user) => {
      return (
        <UserListItem
          key={user.id}
          user={user}
          dialogHandler={this.dialogHandler}
        />
      );
    });
    return (
      <div style={{ width: "60%", margin: "auto" }}>
        <Grid
          className="header"
          container
          direction="row-reverse"
          alignItems="center"
        >
          <Grid item xs>
            <Typography
              variant="h6"
              dir="rtl"
              style={{ color: grey[300], fontSize: 30 }}
            >
              کاربران
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              id="standard-basic"
              variant="standard"
              placeholder="جستجو"
              onChange={(event) => this.onChange(event)}
            />
          </Grid>
          <Grid item xs>
            <IconButton onClick={() => this.dialogHandler("USER_FORM", null)}>
              <PersonAddIcon style={{ color: yellow[500], fontSize: 40 }} />
            </IconButton>
          </Grid>
        </Grid>
        {userItems}
        {this.showDialog()}
      </div>
    );
  }
}
