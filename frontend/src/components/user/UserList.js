import React from "react";
import { Grid, Typography, TextField, IconButton, Button } from "@material-ui/core";
import UserListItem from "./UserListItem";
import { yellow, grey } from "@material-ui/core/colors";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import "./UserList.css";
import AlertDialogSlide from "../dialog/ConfirmationDialog";

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      deleteUser: {
        user: null,
        openDialog: false,
      },
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

  onDelete = (user) => {
    this.setState({
      deleteUser: {
        user: user,
        openDialog: true,
      },
    });
  };

  deletUser = (user) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/users/" + user.id, requestOptions).then((res) =>
      console.log(res)
    );
    this.setState({
      deleteUser: {
        user: null,
        openDialog: false,
      },
    });
    this.fetchData();

    
  };
  onReject = () => {
    this.setState({
      deleteUser: {
        user: null,
        openDialog: false,
      },
    });
  };
  onEdit = () => {
    console.log("OnEdit()");
  };

  showDialog = (deleteUser) => {
    if (deleteUser.user != null) {
      return (
        <AlertDialogSlide
          user={deleteUser.user}
          openDialog={deleteUser.openDialog}
          onAccept={() => this.deletUser(deleteUser.user)}
          onReject={() => this.onReject()}
        />
      );
    }
  };
  render() {
    const { filteredUsers, deleteUser } = this.state;
    const userItems = filteredUsers.map((user) => {
      return (
        <UserListItem
          key={user.id}
          user={user}
          onDelete={() => this.onDelete(user)}
          onEdit={() => this.onEdit()}
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
            <IconButton >
              <PersonAddIcon style={{ color: yellow[500], fontSize: 40 }} />
            </IconButton>
          </Grid>
        </Grid>
        {userItems}
        {this.showDialog(deleteUser)}
      </div>
    );
  }
}
