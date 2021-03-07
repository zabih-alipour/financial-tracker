import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Home from "./components/home/Home";
import UserList from "./components/user/UserList";
import PersonalAccountant from "./components/accountant/PersonalAccountant";
import Investement from "./components/investement/Investement";
import TabPanel from "./components/utils/TabPanel";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
});

const theme = createMuiTheme({
  direction: "rtl",
});

export default function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.App}>
        <Paper className={classes.root} variant="elevation">
          <Tabs
            selectionFollowsFocus
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="صفحه اصلی" />
            <Tab label="کاربران" />
            <Tab label="حساب ها شخصی" />
            <Tab label="سرمایه گذاری" />
          </Tabs>
        </Paper>
        <TabPanel value={value} index={0} component={<Home />} />
        <TabPanel value={value} index={1} component={<UserList />} />
        <TabPanel value={value} index={2} component={<PersonalAccountant />} />
        <TabPanel value={value} index={3} component={<Investement />} />
      </div>
    </ThemeProvider>
  );
}
