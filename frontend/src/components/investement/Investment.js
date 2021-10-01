import React, { useState } from "react";
import { Paper, Tabs, Tab, makeStyles } from "@material-ui/core";
import TabPanel from "../utils/TabPanel";
import InvestmentList from "./InvestementList";
import InvestmentTypeList from "./InvestementTypeList";
import InvestmentReport from "./InvestementReport";

const useStyles = makeStyles({
  content: {
    direction: "rtl  ",
  },
});
export default function Investment(props) {
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
          <Tab label="سرمایه ها" />
          <Tab label="سبد سرمایه" />
          <Tab label="گزارش" />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={1} component={<InvestmentTypeList />} />
      <TabPanel value={value} index={0} component={<InvestmentList />} />
      <TabPanel value={value} index={2} component={<InvestmentReport />} />
    </div>
  );
}
