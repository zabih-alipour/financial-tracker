import { Container } from "@material-ui/core";
import React from "react";
import PaymentReportDetail from "./PaymentReportDetail";

export default class AccountReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
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

  render() {
    const { reports } = this.state;
    const rows = reports.map((p) => {
      return <PaymentReportDetail data={p} />;
    });
    return <Container>{rows}</Container>;
  }
}
