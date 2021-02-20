import React from "react";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  Paper,
} from "@material-ui/core";
import UserListItem from "./UserListItem";
import { yellow, grey } from '@material-ui/core/colors';
import Container from "@material-ui/core/Container";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import "./UserList.css";

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount = () => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ users: data });
      });
  };
  onDelete = () => {
    console.log("OnDelete()");
  };
  onEdit = () => {
    console.log("OnEdit()");
  };
  render() {
    const { users } = this.state;
    const userItems = users.map((user) => {
      return (
        <UserListItem
          key={user.id}
          user={user}
          onDelete={() => this.onDelete()}
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
            <Typography variant="h6" dir="rtl" style={{ color: grey[300], fontSize: 30 }}>
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
            />
          </Grid>
          <Grid item xs>
            <IconButton >
              <PersonAddIcon style={{ color: yellow[500], fontSize: 40 }} />
            </IconButton>
          </Grid>
        </Grid>

        {userItems}
      </div>
    );
  }
}
