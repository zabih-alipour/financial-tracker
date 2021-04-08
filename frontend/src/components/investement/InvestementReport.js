import { Box, Container, Paper } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";
import InvestmentReportDetail from "./InvestmentReportDetails";
import UserAutoComplete from "../user/UserAutoComplete";
import AmountDecorate from "../utils/AmountDecorate";
import { ShowDialog } from "../utils/Dialogs";
import {
  investment_report_summary,
  investment_report_by_user,
} from "../utils/apis";
import UserListPanel from "../user/UserListPanel";

export default class InvestmentReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      summaries: [],
      dialog: "",
      criteria: { user: null, type: null },
    };
  }

  componentDidMount = () => {
    investment_report_summary((data) => this.setState({ summaries: data }));
  };

  onUserChange = (event) => {
    const user = event.target.value;
    investment_report_by_user(user, (data) => this.setState({ details: data }));
  };

  onDetailClick = (user, type, dialog) => {
    this.setState({
      criteria: {
        user: user,
        type: type,
      },
      dialog: dialog,
    });
  };

  onClose = () => {
    this.setState({
      criteria: { user: null, type: null },
      dialog: "",
    });
  };

  handleDialog = () => {
    const { dialog, criteria } = this.state;
    return ShowDialog(
      { user: criteria.user, type: criteria.type, dialog: dialog },
      this.onClose
    );
  };

  summaryComponenet = () => {
    const { summaries } = this.state;
    const row = summaries.map((p, idx) => {
      return (
        <Box display="inline-block" width={1 / summaries.length} key={idx + 1}>
          <Box
            fontSize={15}
            borderBottom={1}
            align="center"
            pb={1}
            pt={1}
            borderLeft={1}
            borderRight={1}
            bgcolor={grey[300]}
          >
            {p.investmentType.name}
          </Box>
          <Box
            fontSize={15}
            pt={1}
            pb={1}
            borderLeft={1}
            borderRight={1}
            align="center"
          >
            <AmountDecorate amount={p.amount} thousand={true} />
          </Box>
        </Box>
      );
    });
    return (
      <Container component={Paper} maxWidth={"xl"} style={{ padding: "0" }}>
        <Box mt={1}>{row}</Box>
      </Container>
    );
  };

  detailsComponenet = () => {
    const { details } = this.state;
    console.log(details);
    const rows = details.map((row, idx) => {
      return (
        <InvestmentReportDetail
          key={idx}
          data={row}
          onActionClick={this.onDetailClick}
        />
      );
    });

    return (
      <Container
        component={Paper}
        style={{ marginTop: "5px",  padding: "5px" }}
      >
        <Box p={1}>
          <UserAutoComplete
            fieldName="dummy"
            onChange={this.onUserChange}
            style={{ width: "99%" }}
          />
        </Box>
        {rows}
      </Container>
    );
  };
  render() {
    return (
      <Box>
        {this.summaryComponenet()}
        <Box p={1} display="flex" flexWrap="nowrap" >
          <Box width="20%" display="inline-block" ml={2}>
            <UserListPanel onClick={this.onUserChange}/>
          </Box>
          <Box width="60%" display="inline-block" ml={2}>
              {this.detailsComponenet()}
          </Box>
          <Box width="20%" display="inline-block">
            akshlk
          </Box>
        </Box>
        {this.handleDialog()}
      </Box>
    );
  }
}
