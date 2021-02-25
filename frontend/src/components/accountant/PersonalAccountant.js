import React, { useState } from "react";
import { Paper, Tabs, Tab, makeStyles } from "@material-ui/core";
import TabPanel from "../utils/TabPanel";
import PaymentList from "./PaymentList";
import PaymentTypeList from "./PaymentTypeList";
import AccountReport from "./AccountReport";

const useStyles = makeStyles({
  content: {
    direction: "rtl  ",
  },
});
export default function PersonalAccountant(props) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.content}>
      <Paper>
        <Tabs
          selectionFollowsFocus
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="دسته بندی " />
          <Tab label="پرداخت ها" />
          <Tab label="گزارش" />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0} component={<PaymentTypeList />} />
      <TabPanel value={value} index={1} component={<PaymentList />} />
      <TabPanel value={value} index={2} component={<AccountReport />} />
    </div>
  );
}
