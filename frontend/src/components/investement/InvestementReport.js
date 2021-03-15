import { Box, Container, Paper, Popper, Typography } from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import React from "react";
import InvestmentReportDetail from "./InvestmentReportDetails";
import UserAutoComplete from "../user/UserAutoComplete";
import AmountDecorate from "../utils/AmountDecorate";
import InvestmentSpecificDetail from "./InvestmentSpecificDetail";

export default class AccountReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      summaries: [],
      openDialog: false,
      criteria: { user: null, type: null },
    };
  }

  componentDidMount = () => {
    fetch("api/investments/reports/summaries")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          summaries: data,
        });
      })
      .catch((e) => console.log(e));
  };

  onDetailClick = (criteria) => {
    this.setState({
      criteria: criteria,
      openDialog: true,
    });
  };

  onClose = () => {
    this.setState({
      criteria: { user: null, type: null },
      openDialog: false,
    });
  };

  handleDialog = () => {
    const { openDialog, criteria } = this.state;
    if (openDialog) {
      return (
        <InvestmentSpecificDetail
          openDialog={true}
          user={criteria.user}
          type={criteria.type}
          onClose={this.onClose}
        />
      );
    }
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
      <Container component={Paper} maxWidth="70%" style={{ padding: "0" }}>
        <Box mt={1}>{row}</Box>
      </Container>
    );
  };

  onUserChange = (event) => {
    const user = event.target.value;
    if (user) {
      fetch("api/investments/reports/" + user.id)
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            details: data,
          });
        })
        .catch((e) => console.log(e));
    }
  };
  detailsComponenet = () => {
    const { details } = this.state;
    const rows = details.map((row, idx) => {
      return <InvestmentReportDetail data={row} onActionClick={this.onDetailClick} />;
    });

    return (
      <Container
        component={Paper}
        style={{ marginTop: "5px", width: "80%", padding: "5px" }}
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
      <Container maxWidth="100%" style={{ padding: "0" }}>
        {this.summaryComponenet()}
        {this.detailsComponenet()}
        {this.handleDialog()}
      </Container>
    );
  }
}
