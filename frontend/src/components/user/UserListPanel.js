import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { get_users_with_detail } from "../utils/apis";
import ImageIcon from "@material-ui/icons/Image";
import AmountDecorate from "../utils/AmountDecorate";

export default function UserListPanel(props) {
  const [users, setUsers] = useState([]);
  const { onClick, showAsset = false, showBalance = false } = props;

  useEffect(() => {
    if (users.length === 0) {
      get_users_with_detail(
        { showAsset: showAsset, showBalance: showBalance },
        (data) => setUsers(data)
      );
    }
  }, [users, showAsset, showBalance]);

  function userItem() {
    return users.map((user, idx) => {
      const subtitle = showAsset
        ? "میزان دارایی: " + user.assets
        : showBalance
        ? "میزان حساب: " + user.balance
        : "";
      return (
        <ListItem
          key={idx}
          button
          divider
          onClick={() => onClick({ target: { name: "user", value: user } })}
        >
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
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
  return (
    <Box component={Paper}>
      <List>{userItem()}</List>
    </Box>
  );
}
