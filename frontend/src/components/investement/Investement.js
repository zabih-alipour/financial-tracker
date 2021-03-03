import React, { useState } from "react";
import { Paper, Tabs, Tab, makeStyles } from "@material-ui/core";
import TabPanel from "../utils/TabPanel";
import InvestementList from "./InvestementList";
import InvestementTypeList from "./InvestementTypeList";
import InvestementReport from "./InvestementReport";

const useStyles = makeStyles({
  content: {
    direction: "rtl  ",
  },
});
export default function Investement(props) {
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
          <Tab label="سبد سرمایه" />
          <Tab label="سرمایه ها" />
          <Tab label="گزارش" />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0} component={<InvestementTypeList />} />
      <TabPanel value={value} index={1} component={<InvestementList />} />
      <TabPanel value={value} index={2} component={<InvestementReport />} />
    </div>
  );
}
