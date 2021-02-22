import React from "react";
import { Grid, Typography, TextField, IconButton } from "@material-ui/core";
import UserListItem from "./UserListItem";
import { yellow, grey } from "@material-ui/core/colors";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import "./UserList.css";
import AlertDialogSlide from "../dialog/ConfirmationDialog";
import UserForm from "./UserForm";

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

  persistUser = (user) => {
    const requestOptions = {
      method: user.id == null ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };
    fetch("/api/users", requestOptions)
      .then((res) => {
        console.log(res);
        this.fetchData();
      })
      .catch((res) => console.log(res));
  };

  deletUser = (user) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/users/" + user.id, requestOptions).then((res) => {
      console.log(res);
      this.fetchData();
    });
  };
  onReject = () => {
    this.setState({
      dialog: "",
      selectedUser: null,
    });
  };

  showDialog = (user) => {
    const { dialog } = this.state;
    if (dialog === "USER_FORM") {
      if (user != null) {
        return (
          <UserForm
            user={user}
            openDialog={true}
            onAccept={this.persistUser}
            onReject={this.onReject}
          />
        );
      } else {
        return (
          <UserForm
            user={user}
            openDialog={true}
            onAccept={this.persistUser}
            onReject={this.onReject}
          />
        );
      }
    } else if (dialog === "DELETE_USER") {
      if (user != null) {
        return (
          <AlertDialogSlide
            data={user}
            openDialog={true}
            onAccept={this.deletUser}
            onReject={this.onReject}
          />
        );
      }
    }
  };

  dialogHandler = (dialog, user) => {
    this.setState({ dialog: dialog, selectedUser: user });
  };

  render() {
    const { filteredUsers, selectedUser } = this.state;
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
          justifyContent="space-between"
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
              fullWidth="true"
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              id="standard-basic"
              variant="standard"
              placeholder="جستجو"
              onChange={(event) => this.onChange(event)}
            />
          </Grid>
          <Grid item xs>
            <IconButton>
              <PersonAddIcon
                onClick={() => this.dialogHandler("USER_FORM", null)}
                style={{ color: yellow[500], fontSize: 40 }}
              />
            </IconButton>
          </Grid>
        </Grid>
        {userItems}
        {this.showDialog(selectedUser)}
      </div>
    );
  }
}
