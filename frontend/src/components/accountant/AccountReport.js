import { Container } from "@material-ui/core";
import React from "react";
import PaymentReportDetail from "./PaymentReportDetail";
import PaymentListPopup from "./PaymentListPopup";

export default class AccountReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      openDialog: false,
      selectedRow: { user: null, type: null },
    };
  }

  componentDidMount = () => {
    fetch("/api/payments/reports")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          reports: data,
        });
      })
      .catch((e) => console.log(e));
  };

  onDetailClick = (selectedRow) => {
    this.setState({
      selectedRow: selectedRow,
      openDialog: true,
    });
  };

  onClose = () => {
    this.setState({
      selectedRow: { user: null, type: null },
      openDialog: false,
    });
  };

  handleDialog = () => {
    const { openDialog, selectedRow } = this.state;
    if (openDialog) {
      return (
        <PaymentListPopup
          openDialog={true}
          user={selectedRow.user}
          type={selectedRow.type}
          onClose={this.onClose}
        />
      );
    }
  };
  render() {
    const { reports } = this.state;
    const rows = reports.map((p, idx) => {
      return (
        <PaymentReportDetail key={idx}
          data={p}
          onDetailClick={this.onDetailClick}
        />
      );
    });
    return (
      <Container>
        {rows}
        {this.handleDialog()}
      </Container>
    );
  }
}
