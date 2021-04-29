import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  Divider,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import EditIcon from "@material-ui/icons/Edit";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ViewHeadlineIcon from "@material-ui/icons/ViewHeadline";
import { green } from "@material-ui/core/colors";
import {INVESTMENT_SPECIFIC_DETAIL_KEY, PAYMENT_LIST_POPUP_KEY, USER_FORM_KEY, USER_PAYMENT_TYPE_DETAIL_KEY } from '../utils/Dialogs'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    direction: "rtl",
    marginBottom: 10,
  },

  details: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

function UserListItem(props) {
  const { user, dialogHandler } = props;
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h6" variant="h6">
            {user.name}
          </Typography>
        </CardContent>

        <Divider light variant="fullWidth" textalign="center" />
        <BottomNavigation>
        <BottomNavigationAction
          onClick={() => dialogHandler(INVESTMENT_SPECIFIC_DETAIL_KEY, user)}
            label="سرمایه ها"
            showLabel
            value="recents"
            icon={<MenuBookIcon color="primary" />}
          />
          <BottomNavigationAction
          onClick={() => dialogHandler(USER_PAYMENT_TYPE_DETAIL_KEY, user)}
            label="پرداخت ها"
            showLabel
            icon={<ViewHeadlineIcon color="primary" />}
          />
          <BottomNavigationAction
            onClick={() => dialogHandler(USER_FORM_KEY, user)}
            label="ویرایش"
            showLabel
            value="favorites"
            icon={<EditIcon style={{ color: green[300] }} />}
          />
          <BottomNavigationAction
            onClick={() => dialogHandler("DELETE_USER", user)}
            label="حذف"
            showLabel
            value="nearby"
            icon={<DeleteSweepIcon color="secondary" />}
          />
        </BottomNavigation>
      </div>
    </Card>
  );
}

export default UserListItem;
