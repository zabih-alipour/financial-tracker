import {
  Avatar,
    Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popover,
  Popper,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { get_users } from "../utils/apis";
import ImageIcon from "@material-ui/icons/Image";

export default function UserListPanel(props) {
  const { searchable = true } = props;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (users.length === 0) {
      get_users((data) => setUsers(data));
    }
  }, [users]);

  function userItem() {
    return users.map((user, idx) => (
      <ListItem key={idx} button>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={user.name} secondary="{user.assets}" />
      </ListItem>
    ));
  }
  return (
    <Box component={Paper}>
      <List>{userItem()}</List>
    </Box>
  );
}
