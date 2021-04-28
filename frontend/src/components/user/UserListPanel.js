import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { get_users_with_detail } from "../utils/apis";
import ImageIcon from "@material-ui/icons/Image";
import AmountDecorate from "../utils/AmountDecorate";
import { DeleteOutline, Refresh, Sort } from "@material-ui/icons";
import {
  amber,
  blue,
  blueGrey,
  brown,
  green,
  grey,
  indigo,
  lime,
  red,
  teal,
} from "@material-ui/core/colors";

export default function UserListPanel(props) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sort, setSort] = useState("none");
  const { onClick, showAsset = false, showBalance = false } = props;

  useEffect(() => {
    if (users.length === 0) {
      get_users_with_detail(
        { showAsset: showAsset, showBalance: showBalance },
        (data) => {
          setUsers(data);
          setFilteredUsers(data);
        }
      );
    }
  }, [users, showAsset, showBalance]);

  function userItem() {
    return filteredUsers.map((user, idx) => {
      return (
        <ListItem
          key={user.id}
          button
          divider
          onClick={() => onClick({ target: { name: "user", value: user } })}
        >
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText component={"div"}
            style={{ textAlign: "right" }}
            primary={user.name}
            secondary={
              <AmountDecorate
                label={showAsset ? "میزان دارایی: " : "میزان حساب: "}
                amount={showAsset ? user.assets : user.balance}
              />
            }
          />
        </ListItem>
      );
    });
  }

  const sortData = () => {
    if (sort === "ASC") {
      setSort("none");
      filteredUsers.sort((a, b) => a.id - b.id);
      setFilteredUsers(filteredUsers);
    } else if (sort === "none") {
      setSort("DESC");
      filteredUsers.sort((a, b) =>
        showAsset ? b.assets - a.assets : b.balance - a.balance
      );
      setFilteredUsers(filteredUsers);
    } else if (sort === "DESC") {
      setSort("ASC");
      filteredUsers.sort((a, b) =>
        showAsset ? a.assets - b.assets : a.balance - b.balance
      );
      setFilteredUsers(filteredUsers);
    }
  };

  return (
    <Box component={Paper}>
      <Box display="flex" borderBottom={1} bgcolor={indigo[100]} p={2}>
        <Box display="inline-block" width="94%">
          <TextField
            fullWidth
            placeholder="جستجو"
            onChange={(event) =>
              setFilteredUsers(
                users.filter((p) => p.name.startsWith(event.target.value))
              )
            }
          />
        </Box>
        <Box display="inline-block" width="6%" alignItems="left">
          <IconButton
            style={{
              display: "inline-block",
              padding: "0px",
              marginLeft: "1px",
            }}
            onClick={() => sortData()}
          >
            <Sort color="primary" />
          </IconButton>
        </Box>
      </Box>
      <List key={sort}>{userItem()}</List>
    </Box>
  );
}
